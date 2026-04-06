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

var today = moment();

var calendarInstance = flatpickr("#datePicker", {
    theme: "airbnb",
    inline: true,
    mode: "multiple",
    dateFormat: "d/m/Y",
    onChange: function() {
        let selectedDatesInDDMMYY = [];
        for (let i = 0; i < calendarInstance.selectedDates.length; i++) {
            selectedDatesInDDMMYY.push(
                moment(calendarInstance.selectedDates[i]).format('DD/MM/YYYY')
            )
        }
        loadSpecialWorkedDaysList(selectedDatesInDDMMYY);
    }    
});

let specialWorkedDaysDropDown = document.getElementById('specialWorkedDays');

let specialWorkedDDays = [];
let specialWorkedDaysHrs = {};

function loadSpecialWorkedDaysList(workedDays) {
    specialWorkedDaysDropDown.innerHTML = '<option disabled selected value> -- select an option -- </option>';
    for(let i=0;i<workedDays.length;i++) {
        let opt = document.createElement('option');
        opt.value = workedDays[i];
        opt.innerHTML = workedDays[i];
        specialWorkedDaysDropDown.appendChild(opt);        
    }
}

function onSpecialWorkedDaySelected() {
    let splWorkDayCard = document.createElement('div');
    splWorkDayCard.classList.add('spl-work-day-card');
    let dayTitle = moment(
        specialWorkedDaysDropDown.value,
        "DD/MM/YYYY"
    ).format('ddd Do MMM YYYY');
    splWorkDayCard.innerHTML = `
        <div class="day-title">${dayTitle}</div>
        <p>Select custom work hours : </p>
        <select data-ddmmyy="${specialWorkedDaysDropDown.value}" onchange="onSplWorkDayHrsChange(event)"></select>
    `;
    let insertedCard = document.getElementById('specialWorkDayList')
    .appendChild(splWorkDayCard);

    let hoursOptions = '';
    for (let i=1; i<=24; i++) {
        hoursOptions = hoursOptions + `
        <option value=${i}>
            ${i} ${i === 1 ? 'hour' : 'hours'}
        </option>`;
    }
    insertedCard.querySelector('select').innerHTML = hoursOptions;

    specialWorkedDDays.push(
        specialWorkedDaysDropDown.value
    );

    specialWorkedDaysHrs[
        specialWorkedDaysDropDown.value
    ] = 1;
}

function onSplWorkDayHrsChange(e) {
    specialWorkedDaysHrs[e.target.dataset.ddmmyy] = e.target.value; 
}

function onMonthPickerChange(selectedDates) {
    if(selectedDates.length === 1) {

        let selectedMonth = moment(selectedDates[0]);
        let workedDays = [];
        for(let i=1;i<=selectedMonth.daysInMonth();i++) {
            let curDay = i < 10 ? `0${i}` : i;
            curDay = curDay + '/' + selectedMonth.format('M') +'/';
            curDay = curDay + selectedMonth.format('yyyy');
            curDay = moment(curDay, 'DD/MM/YYYY');
            if(curDay.format('ddd') !== 'Sat' && curDay.format('ddd') !== 'Sun') {
                workedDays.push(
                    curDay.format('DD/MM/YYYY')
                )
            }
        }
        calendarInstance.clear();
        calendarInstance.setDate(workedDays);
        loadSpecialWorkedDaysList(workedDays);
    }
}

var monthPickerInstance = flatpickr("#monthPicker", {
    theme: "airbnb",
    inline: true,
    plugins: [
        new monthSelectPlugin({
            shorthand: true, //defaults to false
            dateFormat: "m.Y", //defaults to "F Y"
            theme: "airbnb", // defaults to "light",
        })        
    ],
    defaultDate: today.format('MM/YYYY'),
    onChange: function(selectedDates, dateStr, instance) {
        console.log(selectedDates)
        onMonthPickerChange(selectedDates);
    },
    onReady: function (selectedDates) {
        onMonthPickerChange(selectedDates);
    }
});
