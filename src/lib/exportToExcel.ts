import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const exportToExcel = async (data: any[], filename: string) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  // 1️⃣ Add headers including "S.No." and "Amount"
  const headers = ["S.No.", ...Object.keys(data[0]), "Amount"];
  worksheet.addRow(headers);

  // 2️⃣ Style the header row
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0000FF" }, // Blue background
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFF" }, // White text
    };
    cell.alignment = { vertical: "middle", horizontal: "left" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

// 3️⃣ Add data rows with real amount values
data.forEach((item, index) => {
  const row = [
    index + 1,
    ...Object.keys(data[0]).map((key) => item[key]),
    item.amount ?? 0 // Use amount value or 0 if missing
  ];
  worksheet.addRow(row);
});

// 4️⃣ Add "Total" row after data
const totalRow = worksheet.addRow([]);

// Get column index for the last two columns
const totalColumnIndex = headers.length - 1; // second last column
const amountColumnIndex = headers.length;    // last column

// 📘 "Total" label cell
const totalLabelCell = totalRow.getCell(totalColumnIndex);
totalLabelCell.value = "Total";
totalLabelCell.font = { bold: true, color: { argb: "FFFFFF" } };
totalLabelCell.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "0000FF" }, // Blue background
};
totalLabelCell.alignment = { horizontal: "right", vertical: "middle" };
totalLabelCell.border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

// 📗 Total Amount Cell (formula)
const startRow = 2; // data starts from row 2
const endRow = totalRow.number - 1;
const amountColumnLetter = worksheet.getColumn(amountColumnIndex).letter;

const totalAmountCell = totalRow.getCell(amountColumnIndex);
totalAmountCell.value = {
  formula: `SUM(${amountColumnLetter}${startRow}:${amountColumnLetter}${endRow})`,
};
totalAmountCell.font = { bold: true, color: { argb: "FFFFFF" } };
totalAmountCell.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "0000FF" }, // Light grey background
};
totalAmountCell.alignment = { horizontal: "right", vertical: "middle" };
totalAmountCell.border = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};


  // 5️⃣ Auto width for each column
  worksheet.columns.forEach((column) => {
    let maxLength = 10;
    column.eachCell({ includeEmpty: true }, (cell) => {
      const val = cell.value?.toString().length || 0;
      maxLength = Math.max(maxLength, val);
    });
    column.width = maxLength + 2;
  });

  // 6️⃣ Export to file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  });

  saveAs(blob, `${filename}.xlsx`);
};
