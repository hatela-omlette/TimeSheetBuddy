/*
Copyright (C) 2023 Jackson N.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.   
*/

function downloadExcel() {
    const workbook = new ExcelJS.Workbook();

    const signInstance = workbook.addImage({
        base64: settings.signature,
        extension: 'png',
    });

    workbook.creator = settings.workBookCreator;
    workbook.lastModifiedBy = settings.workBookCreator;
    workbook.created = new Date();
    workbook.modified = new Date();

    timeSheetDate = moment(monthPickerInstance.selectedDates[0]);
    const monthlyTimeSheet = workbook.addWorksheet('Monthly Time Sheet');

    monthlyTimeSheet.properties.defaultColWidth = 20;

    //Header row
    const newRow = monthlyTimeSheet.addRow(["" + settings.employerName]);
    monthlyTimeSheet.mergeCells('A1:G1');

    monthlyTimeSheet.mergeCells('A7:B7');
    monthlyTimeSheet.getCell('B7').value = 'Contractor:';

    monthlyTimeSheet.mergeCells('C7:D7');
    monthlyTimeSheet.getCell('D7').value = settings.contractorName;

    monthlyTimeSheet.getCell('E7').value = 'Contractor phone:';

    monthlyTimeSheet.mergeCells('F7:G7');
    monthlyTimeSheet.getCell('G7').value = settings.contractorPhone;

    monthlyTimeSheet.mergeCells('A8:B8');
    monthlyTimeSheet.getCell('B8').value = 'Contractor e-mail:';

    monthlyTimeSheet.mergeCells('C8:D8');
    monthlyTimeSheet.getCell('D8').value = settings.contractorEmail;

    monthlyTimeSheet.mergeCells('E8:F8');
    monthlyTimeSheet.getCell('F8').value = 'Pay period start date:';

    monthlyTimeSheet.getCell('G8').value = timeSheetDate.startOf('month').format('DD/MM/YYYY');

    monthlyTimeSheet.mergeCells('A9:B9');
    monthlyTimeSheet.getCell('B9').value = 'Manager:';

    monthlyTimeSheet.mergeCells('C9:D9');
    monthlyTimeSheet.getCell('D9').value = settings.managerName;

    monthlyTimeSheet.mergeCells('E9:F9');
    monthlyTimeSheet.getCell('F9').value = 'Pay period end date:';

    monthlyTimeSheet.getCell('G9').value = timeSheetDate.endOf('month').format('DD/MM/YYYY');

    var fillObj = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF776A5B' }
    }
    var fontObj = {
        color: { argb: 'FFFFFFFF' }
    }

    var cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

    function setRowColor(cols, rowId, color) {
        let tmp = { ...fillObj };
        tmp.fgColor = { argb: color };
        for (let i = 0; i < cols.length; i++) {
            monthlyTimeSheet.getCell(cols[i] + rowId).fill = tmp;
        }
    }

    monthlyTimeSheet.getCell('A12').value = 'Day';
    monthlyTimeSheet.getCell('A12').fill = fillObj;
    monthlyTimeSheet.getCell('A12').font = fontObj;

    monthlyTimeSheet.getCell('B12').value = 'Date';
    monthlyTimeSheet.getCell('B12').fill = fillObj;
    monthlyTimeSheet.getCell('B12').font = fontObj;

    monthlyTimeSheet.getCell('C12').value = 'Working Hours';
    monthlyTimeSheet.getCell('C12').fill = fillObj;
    monthlyTimeSheet.getCell('C12').font = fontObj;

    monthlyTimeSheet.getCell('D12').value = 'Overtime Hours';
    monthlyTimeSheet.getCell('D12').fill = fillObj;
    monthlyTimeSheet.getCell('D12').font = fontObj;

    monthlyTimeSheet.getCell('E12').value = 'Sick';
    monthlyTimeSheet.getCell('E12').fill = fillObj;
    monthlyTimeSheet.getCell('E12').font = fontObj;

    monthlyTimeSheet.getCell('F12').value = 'Vacation';
    monthlyTimeSheet.getCell('F12').fill = fillObj;
    monthlyTimeSheet.getCell('F12').font = fontObj;

    monthlyTimeSheet.getCell('G12').value = 'Total';
    monthlyTimeSheet.getCell('G12').fill = fillObj;
    monthlyTimeSheet.getCell('G12').font = fontObj;

    monthlyTimeSheet.getCell('H12').value = 'Approved By';
    monthlyTimeSheet.getCell('H12').fill = fillObj;
    monthlyTimeSheet.getCell('H12').font = fontObj;    

    let rowCursor = 13;
    let startDayOfMonth = moment({ ...timeSheetDate }).startOf('month');
    let rowColor = 'ffdee7e5';
    let totalHrs = 0;

    let selectedDatesInDDMMYY = [];
    for (let i = 0; i < calendarInstance.selectedDates.length; i++) {
        selectedDatesInDDMMYY.push(
            moment(calendarInstance.selectedDates[i]).format('DD/MM/YYYY')
        )
    }

    for (let i = 0; i < timeSheetDate.daysInMonth(); i++) {
        setRowColor(cols, rowCursor, rowColor);

        let dayCursor = moment({ ...startDayOfMonth }).add(i, 'days');
        monthlyTimeSheet.getCell('A' + rowCursor).value = moment(dayCursor).format('dddd');
        monthlyTimeSheet.getCell('B' + rowCursor).value = moment(dayCursor).format('DD/MM/YYYY');

        monthlyTimeSheet.getCell('C' + rowCursor).numFmt = '0.00';
        monthlyTimeSheet.getCell('G' + rowCursor).numFmt = '0.00';

        let dayHrs = 0;
        if(selectedDatesInDDMMYY.indexOf(dayCursor.format('DD/MM/YYYY')) != -1) {
            dayHrs = 8;
            if(
                specialWorkedDaysHrs.hasOwnProperty(
                    dayCursor.format('DD/MM/YYYY')
                )
            ) {
                dayHrs = specialWorkedDaysHrs[
                    dayCursor.format('DD/MM/YYYY')
                ]
            }
        }

        dayHrs = Number(dayHrs);

        monthlyTimeSheet.getCell('C' + rowCursor).value = 
        monthlyTimeSheet.getCell('G' + rowCursor).value = dayHrs;

        if(dayHrs > 0) {
            monthlyTimeSheet.getRow(rowCursor).font = {
                bold: true
            };
            totalHrs = totalHrs + dayHrs;
        }

        rowColor = (rowColor === 'ffdee7e5') ? 'ffffffff' : 'ffdee7e5';
        rowCursor = rowCursor + 1;
    }



    monthlyTimeSheet.getCell('A' + rowCursor).fill = fillObj;
    monthlyTimeSheet.getCell('A' + rowCursor).font = fontObj;

    monthlyTimeSheet.getCell('B' + rowCursor).fill = fillObj;
    monthlyTimeSheet.getCell('B' + rowCursor).font = fontObj;
    monthlyTimeSheet.getCell('B' + rowCursor).value = 'Total';

    monthlyTimeSheet.getCell('C' + rowCursor).fill = fillObj;
    monthlyTimeSheet.getCell('C' + rowCursor).font = fontObj;
    monthlyTimeSheet.getCell('C' + rowCursor).numFmt = '0.00';
    monthlyTimeSheet.getCell('C' + rowCursor).value = totalHrs;

    monthlyTimeSheet.getCell('D' + rowCursor).fill = fillObj;
    monthlyTimeSheet.getCell('D' + rowCursor).font = fontObj;
    monthlyTimeSheet.getCell('D' + rowCursor).numFmt = '0.00';
    monthlyTimeSheet.getCell('D' + rowCursor).value = 0;

    monthlyTimeSheet.getCell('E' + rowCursor).fill = fillObj;
    monthlyTimeSheet.getCell('E' + rowCursor).font = fontObj;
    monthlyTimeSheet.getCell('E' + rowCursor).numFmt = '0.00';
    monthlyTimeSheet.getCell('E' + rowCursor).value = 0;

    monthlyTimeSheet.getCell('F' + rowCursor).fill = fillObj;
    monthlyTimeSheet.getCell('F' + rowCursor).font = fontObj;
    monthlyTimeSheet.getCell('F' + rowCursor).numFmt = '0.00';
    monthlyTimeSheet.getCell('F' + rowCursor).value = 0;

    monthlyTimeSheet.getCell('G' + rowCursor).fill = fillObj;
    monthlyTimeSheet.getCell('G' + rowCursor).font = fontObj;
    monthlyTimeSheet.getCell('G' + rowCursor).numFmt = '0.00';
    monthlyTimeSheet.getCell('G' + rowCursor).value = totalHrs;

    rowCursor = rowCursor + 2;

    var topBorder = {
        top: { style: 'thin', color: { argb: '00000000' } }
    };

    monthlyTimeSheet.mergeCells('A' + rowCursor + ':B' + rowCursor);
    monthlyTimeSheet.getCell('B' + rowCursor).border = topBorder;
    monthlyTimeSheet.getCell('B' + rowCursor).value = 'Employee signature';

    monthlyTimeSheet.addImage(signInstance, {
        tl: { col: 3, row: (rowCursor - 1) },
        ext: { width: 80, height: 25 },
        editAs: 'absolute'
    });

    monthlyTimeSheet.getCell('C' + rowCursor).border = topBorder;
    monthlyTimeSheet.getCell('D' + rowCursor).border = topBorder;


    monthlyTimeSheet.getCell('F' + rowCursor).value = 'Date';
    monthlyTimeSheet.getCell('F' + rowCursor).border = topBorder;
    monthlyTimeSheet.getCell('G' + rowCursor).border = topBorder;
    monthlyTimeSheet.getCell('G' + rowCursor).value = moment().format('DD/MM/YYYY');

    rowCursor = rowCursor + 1;

    monthlyTimeSheet.mergeCells('A' + rowCursor + ':B' + rowCursor);
    monthlyTimeSheet.getCell('B' + rowCursor).border = topBorder;
    monthlyTimeSheet.getCell('B' + rowCursor).value = 'Manager signature';

    monthlyTimeSheet.getCell('C' + rowCursor).border = topBorder;
    monthlyTimeSheet.getCell('D' + rowCursor).border = topBorder;

    monthlyTimeSheet.getCell('F' + rowCursor).border = topBorder;
    monthlyTimeSheet.getCell('F' + rowCursor).value = 'Date';

    monthlyTimeSheet.getCell('G' + rowCursor).border = topBorder;

    const outputFileName = `${settings.contractorName}_${timeSheetDate.startOf('month').format('MMMM YYYY')}_timesheet.xlsx`;
    
    workbook.xlsx.writeBuffer().then(buf => {
        saveAs(new Blob([buf]), outputFileName.replaceAll(" ", "_"));
    })

}