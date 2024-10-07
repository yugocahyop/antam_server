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

exports.findStart = async(req, res ) => {
  

  let find =  {$or: [{isStart: true}, {isStart: false} ]};

  controller.find(res, Monitoring, req.query, find, {timeStamp_server:-1});
}

exports.findStartlast = async(req, res ) => {
  

  let find =  {$or: [{isStart: true}, {isStart: false} ]};

  controller.findOne(res, Monitoring, req.query, find, {timeStamp_server:-1});
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

exports.excelPrepare2 = async(req, res ) => {
  let {from, to, sel, intervalT} = req.body;

  const startRange = from/1000;
    const endRange = to/1000;

    // Variabel input sel berapa
    const selectedSel = sel; // Pilih sel untuk disimpan (1-6 untuk sel, 7 untuk elektrolit, 0 untuk semua):

   // Array untuk menyimpan nama file yang akan di-zip
    const fileNames = [];

    const batchInterval = intervalT; // Waktu Interval data yang diambil
    const dataTarget = 75000; // Target data 75k untuk interval > 1
    
    // Interval waktu 1 hari dalam detik
    const interval = 1 * 24 * 60 * 60;

    console.log('Interval time (in seconds):', interval);

    // Function to fill missing values with zero
    const fillWithZero = (value) =>
      value === undefined || value === null ? 0 : value;

      // Format nama file dengan waktu pengambilan
    const generateFileName = (fileStartTime, fileEndTime, fileIndex) => {
      let fileName = `antam-monitoring-`;
      if (fileStartTime && fileEndTime) {
        fileName += `${moment
          .unix(fileStartTime)
          .format('YYYY-MM-DD_HH-mm-ss')}_to_${moment
          .unix(fileEndTime)
          .format('YYYY-MM-DD_HH-mm-ss')}`;
      } else {
        fileName += `part-${fileIndex}`;
      }

      if (selectedSel === 0) {
        fileName += '-all.xlsx';
      } else if (selectedSel === 7) {
        fileName += '-elektrolit.xlsx';
      } else {
        fileName += `-sel${selectedSel}.xlsx`;
      }
      return fileName;
    };

    // Fungsi warna column
    const colorColumns = (worksheet, headers) => {
      let colorFlag = true;
      headers.slice(1).forEach((header, index) => {
        if (index % 5 === 0) {
          colorFlag = !colorFlag;
        }
        const colIndex = index + 2;
        const fillOptions = colorFlag
          ? {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFE9F0E9' },
            }
          : {
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
            right: { style: 'thin' },
          };
        });
      });
    };

    // Fungsi untuk set up worksheet headers and styles
    const setupWorksheet = (worksheet, headers) => {
      worksheet.getRow(1).font = {
        size: 11, // <sz val="11"/>
        color: { theme: 1 }, // <color theme="1"/>
        name: 'Calibri', // <name val="Calibri"/>
        family: 2, // <family val="2"/>
        scheme: 'minor', // <scheme val="minor"/>
        bold: true,
      };

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
              scheme: 'minor',
            },
          },
        },
        ...headers.slice(1).map((header) => ({
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
              scheme: 'minor',
            },
          },
        })),
      ];

      colorColumns(worksheet, headers);
    };

    // Function to calculate the weighted sum and total weight for a small batch
    const calculatePartialWeightedSum = (
      data,
      partialEnd,
      key,
      isLastPartial,
      batchEnd
    ) => {
      let weightedSum = 0;
      let totalWeight = 0;

      for (let i = 1; i < data.length; i++) {
        const prevTime = data[i - 1].timeStamp;
        const currTime = data[i].timeStamp;

        // Convert to moment objects to handle time differences
        const prev = moment(prevTime * 1000);
        const curr = moment(currTime * 1000);

        // Calculate the time difference (weight) in seconds between two timestamps
        const weight = curr.diff(prev, 'seconds');
        totalWeight += weight;

        // Add to weighted sum
        weightedSum += data[i - 1].value * weight;
      }

      // Handle last data only if this is the last partial
      if (isLastPartial && data.length > 0) {
        const lastTime = data[data.length - 1].timeStamp;
        const lastMoment = moment(lastTime * 1000);
        const batchEndMoment = moment(batchEnd * 1000);

        // Calculate time difference between last data and batch end
        const lastWeight = batchEndMoment.diff(lastMoment, 'seconds');

        // Ensure lastWeight is not negative
        const adjustedLastWeight = Math.max(lastWeight, 1);

        // Add to weighted sum and total weight
        weightedSum += data[data.length - 1].value * adjustedLastWeight;
        totalWeight += adjustedLastWeight;
      }

      return { weightedSum, totalWeight };
    };

    // Main processing logic
    if (batchInterval == 1) {
      {
        // Existing behavior for batchInterval == 1
        for (let time = startRange; time < endRange; time += interval) {
          const startTime = time;
          let endTime = Math.min(time + interval, endRange);
  
          // Adjust endTime if interval is exactly 2 days (172800 seconds)
          if (endTime - startTime === interval) {
            endTime -= 1; // Reduce 1 second if exactly 2 days
          }
  
          console.log(
            `Processing data from ${moment
              .unix(startTime)
              .format('YYYY-MM-DD HH:mm:ss')} to ${moment
              .unix(endTime)
              .format('YYYY-MM-DD HH:mm:ss')}`
          );
  
          // Format file name with data time range
          let fileName = `antam-monitoring-${moment
            .unix(startTime)
            .format('YYYY-MM-DD_HH-mm-ss')}_to_${moment
            .unix(endTime)
            .format('YYYY-MM-DD_HH-mm-ss')}`;
          if (selectedSel === 0) {
            fileName += '-all.xlsx';
          } else if (selectedSel === 7) {
            fileName += '-elektrolit.xlsx';
          } else {
            fileName += `-sel${selectedSel}.xlsx`;
          }
  
          // Set up streaming for large data
          const writeStream = fs.createWriteStream(fileName);
          const wb = new ExcelJS.stream.xlsx.WorkbookWriter({
            stream: writeStream,
            useSharedStrings: true,
            useStyles: true,
          });
  
          // Add worksheet with options to freeze header row
          const sheetName = 'Monitoring Data';
          const worksheet = wb.addWorksheet(sheetName, {
            views: [{ state: 'frozen', ySplit: 1, xSplit: 1 }],
          });
  
          const headers = ['Tanggal'];
          const maxSel = 6; // Only up to cell 6
  
          // Create headers based on selected cell
          if (selectedSel === 0) {
            // All cells
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
            // Only electrolyte cell
            headers.push('Sel Elektrolit \nSuhu');
            headers.push('Sel Elektrolit \npH');
          } else if (selectedSel >= 1 && selectedSel <= 6) {
            // Only specific cell
            for (let subSel = 1; subSel <= 5; subSel++) {
              headers.push(`Sel ${selectedSel}-${subSel} \nTegangan`);
              headers.push(`Sel ${selectedSel}-${subSel} \nArus`);
              headers.push(`Sel ${selectedSel}-${subSel} \nDaya`);
              headers.push(`Sel ${selectedSel}-${subSel} \nEnergi`);
              headers.push(`Sel ${selectedSel}-${subSel} \nSuhu`);
            }
          }
  
          // Setup worksheet headers and styles
          setupWorksheet(worksheet, headers);
  
          let batchSize = 1000;
          let skip = 0;
          let hasMore = true;
  
          while (hasMore) {
            // Aggregation pipeline to fetch data from Monitoring collection
            const pipeline = [
              { $match: { timeStamp: { $gte: startTime, $lte: endTime } } },
              { $sort: { timeStamp: 1 } },
              { $skip: skip },
              { $limit: batchSize },
            ];
  
            const data = await Monitoring.aggregate(pipeline)
              .allowDiskUse(true)
              .exec();
  
            if (data.length === 0) {
              hasMore = false;
              break;
            }
  
            // Process each document in the current batch
            data.forEach((entry) => {
              const row = [
                moment.unix(entry.timeStamp).format('DD MMM YYYY HH:mm:ss'),
              ]; // Format timeStamp
  
              // Fill data based on selected cell

              if(typeof entry["isStart"] !== 'undefined'){
                row.push(`Proses ER2 ` + (entry["isStart"]? "dimulai" : "berhenti" ));
              }
              else if (selectedSel === 0) {
                for (let sel = 1; sel <= maxSel; sel++) {
                  for (let subSel = 1; subSel <= 5; subSel++) {
                    const t =
                      (entry.tangkiData[sel - 1] || [])[subSel - 1] || {};
                    row.push(fillWithZero(t.tegangan));
                    row.push(fillWithZero(t.arus));
                    row.push(fillWithZero(t.daya));
                    row.push(fillWithZero(t.energi));
                    row.push(fillWithZero(t.suhu));
                  }
                }
                const sel7_1Data = entry.tangkiData[6]
                  ? entry.tangkiData[6][0]
                  : {};
                row.push(fillWithZero(sel7_1Data.suhu));
                row.push(fillWithZero(sel7_1Data.pH));
              } else if (selectedSel === 7) {
                const sel7_1Data = entry.tangkiData[6]
                  ? entry.tangkiData[6][0]
                  : {};
                row.push(fillWithZero(sel7_1Data.suhu));
                row.push(fillWithZero(sel7_1Data.pH));
              } else if (selectedSel >= 1 && selectedSel <= 6) {
                for (let subSel = 1; subSel <= 5; subSel++) {
                  const t =
                    (entry.tangkiData[selectedSel - 1] || [])[subSel - 1] || {};
                  row.push(fillWithZero(t.tegangan));
                  row.push(fillWithZero(t.arus));
                  row.push(fillWithZero(t.daya));
                  row.push(fillWithZero(t.energi));
                  row.push(fillWithZero(t.suhu));
                }
              }
  
              worksheet.addRow(row).commit(); // Add row and immediately write to disk
            });
  
            skip += batchSize; // Update skip for the next batch
          }
  
          await wb.commit(); // Make sure the workbook is fully written before proceeding
          console.log(`Data saved to ${fileName}`);
          fileNames.push(fileName); // Add the file name to the list of files to be zipped
        }
      }
    } else {
      // Revised behavior for batchInterval > 1
      console.log('Processing data with batchInterval > 1');

      // Initialize variables for tracking
      let totalRowsCommitted = 0;
      let fileRowsCommitted = 0;
      let fileStartTime = null;
      let fileEndTime = null;
      let currentFileIndex = 1;

      // Initialize the first Excel file
      let fileName = generateFileName(null, null, currentFileIndex);
      let writeStream = fs.createWriteStream(fileName);
      let wb = new ExcelJS.stream.xlsx.WorkbookWriter({
        stream: writeStream,
        useSharedStrings: true,
        useStyles: true,
      });
      const sheetName = 'Monitoring Data';
      let worksheet = wb.addWorksheet(sheetName, {
        views: [{ state: 'frozen', ySplit: 1, xSplit: 1 }],
      });

      const headers = ['Tanggal'];
      const maxSel = 6; // Only up to cell 6

      // Create headers based on selected cell
      if (selectedSel === 0) {
        // All cells
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
        // Only electrolyte cell
        headers.push('Sel Elektrolit \nSuhu');
        headers.push('Sel Elektrolit \npH');
      } else if (selectedSel >= 1 && selectedSel <= 6) {
        // Only specific cell
        for (let subSel = 1; subSel <= 5; subSel++) {
          headers.push(`Sel ${selectedSel}-${subSel} \nTegangan`);
          headers.push(`Sel ${selectedSel}-${subSel} \nArus`);
          headers.push(`Sel ${selectedSel}-${subSel} \nDaya`);
          headers.push(`Sel ${selectedSel}-${subSel} \nEnergi`);
          headers.push(`Sel ${selectedSel}-${subSel} \nSuhu`);
        }
      }

      // Setup worksheet headers and styles
      setupWorksheet(worksheet, headers);

      let currentBatchStart = startRange;

      while (currentBatchStart < endRange) {
        if (fileRowsCommitted === 0) {
          fileStartTime = currentBatchStart;
        }

        const batchEnd = Math.min(
          currentBatchStart + batchInterval - 1,
          endRange
        );

        console.log(
          `Processing batch from ${moment
            .unix(currentBatchStart)
            .format('YYYY-MM-DD HH:mm:ss')} to ${moment
            .unix(batchEnd)
            .format('YYYY-MM-DD HH:mm:ss')}`
        );

        const partialWeightedSums = {};
        const totalWeights = {};

        let partialStart = currentBatchStart;
        let previousLastDataPoint = null;

        while (partialStart <= batchEnd) {
          const partialEnd = Math.min(partialStart + 999, batchEnd);
          const isLastPartial = partialEnd === batchEnd;

          const pipeline = [
            {
              $match: {
                timeStamp: { $gte: partialStart, $lte: partialEnd },
              },
            },
            { $sort: { timeStamp: 1 } },
          ];

          let data = await Monitoring.aggregate(pipeline)
            .allowDiskUse(true)
            .exec();

          // If there's a previous last data point, add it to the current data if not a duplicate
          if (previousLastDataPoint) {
            if (
              data.length > 0 &&
              data[0].timeStamp !== previousLastDataPoint.timeStamp
            ) {
              data.unshift(previousLastDataPoint);
            }
          }

          // Save the last data point for the next partial
          if (data.length > 0) {
            previousLastDataPoint = data[data.length - 1];
          } else {
            previousLastDataPoint = null;
          }

          // Process data into processedData
          const processedData = [];
          data.forEach((entry) => {
            const row = { timeStamp: entry.timeStamp };
            if (selectedSel === 0) {
              for (let sel = 1; sel <= maxSel; sel++) {
                for (let subSel = 1; subSel <= 5; subSel++) {
                  const t =
                    (entry.tangkiData[sel - 1] || [])[subSel - 1] || {};
                  row[`Sel ${sel}-${subSel} Tegangan`] = fillWithZero(
                    t.tegangan
                  );
                  row[`Sel ${sel}-${subSel} Arus`] = fillWithZero(t.arus);
                  row[`Sel ${sel}-${subSel} Daya`] = fillWithZero(t.daya);
                  row[`Sel ${sel}-${subSel} Energi`] = fillWithZero(t.energi);
                  row[`Sel ${sel}-${subSel} Suhu`] = fillWithZero(t.suhu);
                }
              }
              const sel7_1Data = entry.tangkiData[6]
                ? entry.tangkiData[6][0]
                : {};
              row['Sel Elektrolit Suhu'] = fillWithZero(sel7_1Data.suhu);
              row['Sel Elektrolit pH'] = fillWithZero(sel7_1Data.pH);
            } else if (selectedSel === 7) {
              const sel7_1Data = entry.tangkiData[6]
                ? entry.tangkiData[6][0]
                : {};
              row['Sel Elektrolit Suhu'] = fillWithZero(sel7_1Data.suhu);
              row['Sel Elektrolit pH'] = fillWithZero(sel7_1Data.pH);
            } else if (selectedSel >= 1 && selectedSel <= 6) {
              for (let subSel = 1; subSel <= 5; subSel++) {
                const t =
                  (entry.tangkiData[selectedSel - 1] || [])[subSel - 1] || {};
                row[`Sel ${selectedSel}-${subSel} Tegangan`] = fillWithZero(
                  t.tegangan
                );
                row[`Sel ${selectedSel}-${subSel} Arus`] = fillWithZero(
                  t.arus
                );
                row[`Sel ${selectedSel}-${subSel} Daya`] = fillWithZero(
                  t.daya
                );
                row[`Sel ${selectedSel}-${subSel} Energi`] = fillWithZero(
                  t.energi
                );
                row[`Sel ${selectedSel}-${subSel} Suhu`] = fillWithZero(
                  t.suhu
                );
              }
            }
            processedData.push(row);
          });

          // Aggregate partial results
          const partialResults = {};
          processedData.forEach((item) => {
            const timeStamp = item.timeStamp;
            Object.keys(item).forEach((key) => {
              if (key !== 'timeStamp') {
                partialResults[key] = partialResults[key] || [];
                partialResults[key].push({
                  timeStamp,
                  value: item[key],
                });
              }
            });
          });

          // Calculate weightedSum and totalWeight for each key
          Object.keys(partialResults).forEach((key) => {
            const { weightedSum, totalWeight } = calculatePartialWeightedSum(
              partialResults[key],
              partialEnd,
              key,
              isLastPartial,
              batchEnd
            );
            partialWeightedSums[key] =
              (partialWeightedSums[key] || 0) + weightedSum;
            totalWeights[key] = (totalWeights[key] || 0) + totalWeight;
          });

          partialStart += 1000;
        }

        // Calculate weighted average
        const finalRow = [
          moment.unix(currentBatchStart).format('DD MMM YYYY HH:mm:ss'),
        ];
        let hasData = false; // Flag to check if finalRow contains actual data

        Object.keys(partialWeightedSums).forEach((key) => {
          const weightedAverage =
            partialWeightedSums[key] / totalWeights[key];
          finalRow.push(weightedAverage);

          // Check if the weightedAverage is not undefined, null, or NaN
          if (
            weightedAverage !== undefined &&
            weightedAverage !== null &&
            !isNaN(weightedAverage)
          ) {
            hasData = true;
          }
        });

        // Only commit the row if it contains actual data
        if (hasData) {
          worksheet.addRow(finalRow).commit(); // Write to disk after batch is complete

          fileRowsCommitted += 1;
          totalRowsCommitted += 1;
          fileEndTime = batchEnd;

          // Check if we need to start a new Excel file
          if (fileRowsCommitted >= dataTarget) {
            // Close current Excel file
            await wb.commit();

            // Adjust file name to include start and end times
            const oldFileName = fileName;
            fileName = generateFileName(
              fileStartTime,
              fileEndTime,
              currentFileIndex
            );
            fs.renameSync(oldFileName, fileName);
            console.log(`Data saved to ${fileName}`);
            fileNames.push(fileName); // Add the file name to the list of files to be zipped

            // Start a new Excel file
            currentFileIndex += 1;
            fileRowsCommitted = 0;
            fileStartTime = null;
            fileEndTime = null;

            fileName = generateFileName(null, null, currentFileIndex);
            writeStream = fs.createWriteStream(fileName);
            wb = new ExcelJS.stream.xlsx.WorkbookWriter({
              stream: writeStream,
              useSharedStrings: true,
              useStyles: true,
            });
            worksheet = wb.addWorksheet(sheetName, {
              views: [{ state: 'frozen', ySplit: 1, xSplit: 1 }],
            });

            // Setup worksheet headers and styles
            setupWorksheet(worksheet, headers);
          }
        }

        currentBatchStart += batchInterval;
      }

      // After processing all batches, commit and rename the last file
      await wb.commit();
      if (fileRowsCommitted > 0) {
        const oldFileName = fileName;
        fileName = generateFileName(
          fileStartTime,
          fileEndTime,
          currentFileIndex
        );
        fs.renameSync(oldFileName, fileName);
        console.log(`Data saved to ${fileName}`);
        fileNames.push(fileName);
      } else {
        // If no data was written, delete the empty file
        fs.unlinkSync(fileName);
      }
    }

    // If there is more than one file, create a ZIP file
    if (fileNames.length > 1) {
      const zipFileName = `antam-monitoring-${moment
        .unix(startRange)
        .format('YYYY-MM-DD_HH-mm-ss')}_to_${moment
        .unix(endRange)
        .format('YYYY-MM-DD_HH-mm-ss')}.zip`;

      // Create a file to stream archive data to
      const output = fs.createWriteStream(zipFileName);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Sets the compression level
      });

      // Pipe archive data to the file
      archive.pipe(output);

      // Append each file to the archive
      fileNames.forEach((file) => {
        archive.append(fs.createReadStream(file), {
          name: file.split('/').pop(),
        });
      });
     // Finalize the archive (i.e., we are done appending files but streams have to finish yet)
      await new Promise((resolve, reject) => {
        output.on('close', () => {
          console.log(`${archive.pointer()} total bytes`);
          console.log(`Archive has been finalized and the output file ${zipFileName}`);

          // Delete the individual Excel files after zipping
          fileNames.forEach((file) => fs.unlinkSync(file));
          resolve();
        });

        archive.on('error', reject);
        archive.finalize();
      });

      console.log(`Data compressed into ${zipFileName}`);
      // let finalFileName = zipFileName;
      // console.log(`${finalFileName}`);

      res.send({file: zipFileName});
    }
    else if (fileNames.length == 1){
      // let finalFileName = fileNames[0];
      // console.log(`${finalFileName}`);

      res.send({file: fileNames[0]});

      
    }

    // process.exit();

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
        if(typeof entry["isStart"] !== 'undefined'){
          row.push(`Proses ER2 ` + (entry["isStart"]? "dimulai" : "berhenti" ));
        }
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