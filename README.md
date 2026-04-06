# TimeSheetBuddy

A lightweight browser app that helps contractors build a monthly timesheet Excel workbook by selecting workdays in a calendar and exporting a styled spreadsheet.

## Repository contents
- `index.html` – single-page UI with month picker, default workday selection, special workday overrides, and download trigger.
- `styles/` – CSS for the floating layout plus Flatpickr themes.
- `scripts/` – third-party libraries (ExcelJS, FileSaver, Flatpickr, Moment) plus `app.js`, `config.js`, and `excel_export.js` that wire up the picker, track hours, and build the workbook.

## Quick start
1. Open `index.html` directly in your browser (no local server is required).
2. Use the UI:
   - Choose the target month with the **Month Picker** (left side).
   - The calendar auto-fills all weekdays as 8-hour workdays. If you worked on additional dates, click them in the date picker and then use **Special Work Days** to record custom hours.
   - Click **Download** to generate `CONTRACTORNAME_MMMM YYYY_timesheet.xlsx` (sheet layout, totals, signature, etc.) and save it locally.

## Customization
- `scripts/config.js` holds employer and contractor metadata plus the embedded signature image that appear in the workbook. Update `employerName`, `contractorName`, contact fields, or replace the `signature` base64 if needed.
- You can tweak default hours, row styling, or add new columns by editing `scripts/excel_export.js`.

## Verification & caution
- The app assigns 8 hours to every non-weekend day by default and only records custom hours for dates you explicitly pick in **Special Work Days**. Double-check the calendar selections before export.
- The code performs client-side math without any validation step; always verify that the Excel workbook’s totals, dates, and any currency amounts (if you extend the sheet) match your own records before submitting or paying.
- The UI already warns not to “trust it blindly”—treat the generated workbook as a draft that must be reviewed against your official timesheet records.

## Notes
- No build step is required because all assets are static. You can open `index.html` via `file://` or host the folder on any static server; both work because all dependencies are bundled locally.
- All dependencies are included under `scripts/` so this tool works offline once cloned.
