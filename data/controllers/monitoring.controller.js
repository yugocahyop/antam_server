const ExcelJS = require('exceljs');
const fs = require( 'fs');
const moment = require( 'moment');
const archiver = require('archiver'); 

const path = require("path");

const Monitoring = require("../models/monitoring.model.js");

const controller = require("./controller.js");
const { timeStamp } = require('console');



const inputList =  [ 
    "timeStamp",
    "tangkiData" 
];

const struct =  {
    timeStamp: "Number",
    tangkiData : "Array",
};

exports.structMonitoring = struct;
exports.inputListMontioring = inputList;


exports.create =  async(req, res) => {

    
    controller.create(res, Monitoring, req.body, null, inputList, struct , "Monitoring" );
}

exports.update =  async(req, res) => {
   
    

  
    // console.log(f);

   
    controller.update(res, Monitoring, req.body, req.params.id, inputList, struct , "Monitoring" );
    
}

exports.find = async(req, res ) => {
    let {from, to} = req.body;

    if(typeof from === 'undefined'){
        res.status(400).send({error: "from is required"});
        return;
    }

    let find = to ? {$and: [{timeStamp_server: {$gte: from}}, {timeStamp_server: {$lte: to}} ]} : {timeStamp_server: {$gte: from}};

    controller.find(res, Monitoring, req.query, find, {timeStamp_server:-1});
}

exports.findLast = async(req, res ) => {
  
    
    controller.findOne(res, Monitoring, req.query, {}, {timeStamp_server:-1});
}

exports.delete = async(req, res) =>{

   

    // const f = await Monitoring.findOne({user_id: user_id, mac: mac}).exec();

    controller.delete(res, Monitoring, req.params.id);

    

    
}

exports.excelDownload = async(req, res) =>{

   

  // const f = await Monitoring.findOne({user_id: user_id, mac: mac}).exec();

  // controller.delete(res, Monitoring, req.params.id);

  let {file} = req.query;

  console.log(`filename: ${file}`)

  res.download(`./${file}`);  

  
}

exports.excelPrepare = async(req, res ) => {
    let {from, to, sel} = req.body;

    if(typeof from === 'undefined'){
        res.status(400).send({error: "from is required"});
        return;
    }

    const startRange = from /1000; // Mulai dari tanggal 12 jam 08:00:00
    const endRange = to /1000;   // Sampai akhir tanggal 12 jam 09:00:00

    // Interval waktu 2 hari dalam detik
    const interval = 2 * 24 * 60 * 60;

    // Variabel input sel berapa
    const selectedSel = sel; // Pilih sel untuk disimpan (1-6 untuk sel, 7 untuk elektrolit, 0 untuk semua):

    // Array untuk menyimpan nama file yang akan di-zip
    const fileNames = [];

    for (let time = startRange; time < endRange; time += interval) {
      const startTime = time;
      let endTime = Math.min(time + interval, endRange);

      // Jika interval tepat 2 hari (172800 detik), kurangi 1 detik dari endTime
      if (endTime - startTime === interval) {
        endTime -= 1; // Mengurangi 1 detik jika tepat 2 hari
      }

      console.log(`Processing data from ${moment.unix(startTime).format('YYYY-MM-DD HH:mm:ss')} to ${moment.unix(endTime).format('YYYY-MM-DD HH:mm:ss')}`);

      // Query data dari koleksi Monitoring untuk interval waktu yang ditentukan
      const cursor = Monitoring.find({
        timeStamp: {
          $gte: startTime,
          $lte: endTime
        }
      }).sort({ timeStamp: 1 }).lean().cursor();

      // Format nama file dengan waktu pengambilan
      let fileName = `antam-monitoring-${moment.unix(startTime).format('YYYY-MM-DD_HH-mm-ss')}_to_${moment.unix(endTime).format('YYYY-MM-DD_HH-mm-ss')}`;
      if (selectedSel === 0) {
        fileName += '-all.xlsx';
      } else if (selectedSel === 7) {
        fileName += '-elektrolit.xlsx';
      } else {
        fileName += `-sel${selectedSel}.xlsx`;
      }

      // fileName =  `./${fileName}`;
      // Set up streaming for large data
      const writeStream = fs.createWriteStream(fileName);
      const wb = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: writeStream, useSharedStrings: true, useStyles: true });

      // Tambahkan worksheet dengan opsi untuk membekukan baris header
      const sheetName = 'Monitoring Data';
      const worksheet = wb.addWorksheet(sheetName, {
        views: [{ state: 'frozen', ySplit: 1 , xSplit: 1 }]
      });

      const headers = ['Tanggal'];
      const maxSel = 6; // Hanya sampai sel 6 

      // Buat header sesuai dengan pilihan sel
      if (selectedSel === 0) {
        // Semua sel
        for (let sel = 1; sel <= maxSel; sel++) {
          for (let subSel = 1; subSel <= 5; subSel++) {
            headers.push(`Sel ${sel}-${subSel} \nTegangan`);
            headers.push(`Sel ${sel}-${subSel} \nArus`);
            headers.push(`Sel ${sel}-${subSel} \nDaya`);
            headers.push(`Sel ${sel}-${subSel} \nEnergi`);
            headers.push(`Sel ${sel}-${subSel} \nSuhu`);
          }
        }
        headers.push('Sel Elektrolit \nSuhu');
        headers.push('Sel Elektrolit \npH');
      } else if (selectedSel === 7) {
        // Hanya sel elektrolit
        headers.push('Sel Elektrolit \nSuhu');
        headers.push('Sel Elektrolit \npH');
      } else if (selectedSel >= 1 && selectedSel <= 6) {
        // Hanya sel tertentu
        for (let subSel = 1; subSel <= 5; subSel++) {
          headers.push(`Sel ${selectedSel}-${subSel} \nTegangan`);
          headers.push(`Sel ${selectedSel}-${subSel} \nArus`);
          headers.push(`Sel ${selectedSel}-${subSel} \nDaya`);
          headers.push(`Sel ${selectedSel}-${subSel} \nEnergi`);
          headers.push(`Sel ${selectedSel}-${subSel} \nSuhu`);
        }
      }

      // Set width for the first column ("Tanggal") and use default widths for others
      worksheet.columns = [
        { 
          header: headers[0], 
          key: 'tanggal', 
          width: 20, 
          style: { 
            alignment: { 
              wrapText: true, 
              vertical: 'top' 
            },
            font: {
              name: 'Calibri',
              size: 11,
              color: { theme: 1 }
            }
          } 
        }, // Set width for "Tanggal" column
        ...headers.slice(1).map(header => ({
          header,
          key: header,
          width: 10,
          style: { 
            alignment: { 
              wrapText: true, 
              vertical: 'top' 
            },
            font: {
              name: 'Calibri',
              size: 11,
              color: { theme: 1 }
            }
          }
        }))
      ];

      worksheet.getRow(1).font = {
        size: 11,             // <sz val="11"/>
        color: { theme: 1 },  // <color theme="1"/>
        name: 'Calibri',      // <name val="Calibri"/>
        family: 2,            // <family val="2"/>
        scheme: 'minor',      // <scheme val="minor"/>
        bold: true
    };

      // Function to handle missing values and replace them with 0
      const fillWithZero = value => (value === undefined || value === null ? 0 : value);

      // Setup worksheet columns with styles
      worksheet.columns = [
        { 
          header: 'Tanggal', 
          key: 'tanggal', 
          width: 20, 
          style: { 
            alignment: { wrapText: true, vertical: 'top' }, 
            font: {
              size: 11, 
              color: { theme: 1 }, 
              name: 'Calibri', 
              family: 2, 
              scheme: 'minor'
            }
          } 
        },
        ...headers.slice(1).map(header => ({
          header,
          key: header,
          width: 10,
          style: { 
            alignment: { wrapText: true, vertical: 'top' }, 
            font: {
              size: 11, 
              color: { theme: 1 }, 
              name: 'Calibri', 
              family: 2, 
              scheme: 'minor'
            }
          }
        }))
      ];
      
    //   const colorColumns = () => {
        let colorFlag = true;
        headers.slice(1).forEach((header, index) => {
          if (index % 5 === 0) {
            colorFlag = !colorFlag;
          }
          const colIndex = index + 2;
          const fillOptions = colorFlag ? {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE9F0E9' },
          } : {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFFFFFF' },
          };
      
          const col = worksheet.getColumn(colIndex);
          col.fill = fillOptions;
          col.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });
    //   };
      
    //   colorColumns();
      
      // Process each document from the cursor
      for await (const entry of cursor) {
        const row = [moment.unix(entry.timeStamp).format('DD MMM YYYY HH:mm:ss')]; // Format timeStamp

        // Isi data sesuai dengan pilihan sel
        if (selectedSel === 0) {
          for (let sel = 1; sel <= maxSel; sel++) {
            for (let subSel = 1; subSel <= 5; subSel++) {
              const t = entry.tangkiData[sel - 1][subSel - 1] || {};
              row.push(fillWithZero(t.tegangan));
              row.push(fillWithZero(t.arus));
              row.push(fillWithZero(t.daya));
              row.push(fillWithZero(t.energi));
              row.push(fillWithZero(t.suhu));
            }
          }
          const sel7_1Data = entry.tangkiData[6] ? entry.tangkiData[6][0] : {};
          row.push(fillWithZero(sel7_1Data.suhu));
          row.push(fillWithZero(sel7_1Data.pH));
        } else if (selectedSel === 7) {
          const sel7_1Data = entry.tangkiData[6] ? entry.tangkiData[6][0] : {};
          row.push(fillWithZero(sel7_1Data.suhu));
          row.push(fillWithZero(sel7_1Data.pH));
        } else if (selectedSel >= 1 && selectedSel <= 6) {
          for (let subSel = 1; subSel <= 5; subSel++) {
            const t = entry.tangkiData[selectedSel - 1][subSel - 1] || {};
            row.push(fillWithZero(t.tegangan));
            row.push(fillWithZero(t.arus));
            row.push(fillWithZero(t.daya));
            row.push(fillWithZero(t.energi));
            row.push(fillWithZero(t.suhu));
          }
        }

        worksheet.addRow(row).commit(); // Add row and immediately write to disk
      }

      await wb.commit(); // Make sure the workbook is fully written before proceeding
      console.log(`Data saved to ${fileName}`);
      fileNames.push(fileName); // Add the file name to the list of files to be zipped
    }

    // If there is more than one file, create a ZIP file
    if (fileNames.length > 1) {
      let zipFileName = `antam-monitoring-${moment.unix(startRange).format('YYYY-MM-DD_HH-mm-ss')}_to_${moment.unix(endRange).format('YYYY-MM-DD_HH-mm-ss')}.zip`;

      // Create a file to stream archive data to
      // zipFileName =  `./${zipFileName}`
      const output = fs.createWriteStream(zipFileName);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level
      });

      // Pipe archive data to the file
      archive.pipe(output);

      // Append each file to the archive
      fileNames.forEach(file => {
        archive.append(fs.createReadStream(file), { name: file.split('/').pop() });
      });

      // Finalize the archive (i.e., we are done appending files but streams have to finish yet)
      await new Promise((resolve, reject) => {
        output.on('close', () => {
        //   console.log(`${archive.pointer()} total bytes`);
        //   console.log(`Archive has been finalized and the output file ${zipFileName}`);
          
          // Delete the individual Excel files after zipping
          fileNames.forEach(file => fs.unlinkSync(file));
          resolve();
        });
        
        archive.on('error', reject);
        archive.finalize();
      });

      console.log(`Data compressed into ${zipFileName}`);
        res.send({file: zipFileName});
    }else{
        res.send({file: fileNames[0]});
    }
}