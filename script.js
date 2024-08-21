// nav used to track the month
let nav = 0;

// clicked to check which date user clicked on (initially null)
let clicked = null;

// take the events stored in local storage and parse in json or else return empty array
// events used to store the events stored by the user
let events = localStorage.getItem('events') ? JSON.parse(localStorage.getItem('events')) : [];

// weekdays array to determine the padding days
const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
// calendar variable so as to not again and again reference it
const calendar = document.getElementById('calendar');

// function to open the modal when clicked on certain date
function openModal(date){
    // set clicked = date to store the clicked date globally
    clicked = date;
    // check if event exists on clicked date
    const eventForDay = events.find(e=>e.date===clicked);
    if(eventForDay){
        console.log('Event Already Exists');
        document.getElementById('eventText').innerText = eventForDay.title;
        deleteEventModal.style.display = 'block';
    }
    // if not then set newEventModal style display to block from hidden
    else{
        newEventModal.style.display = 'block';
        backDrop.style.display = 'block';
    }
}

// a function called load that would be used to load our calendar or website 
function load(){
    const dt = new Date();
    console.log(dt);
    if(nav!==0){
        dt.setMonth(new Date().getMonth()+nav);
    }
    const day = dt.getDate();
    const month = dt.getMonth();
    const year = dt.getFullYear();
    // month always displayed after adding 1 as 0 indexed
    // to get days in a month , give day as 0 meaning the last date of previous month
    const daysInMonth = new Date(year,month+1,0).getDate();
    // first day of month gets the whole date object , we used to LocaleDateString method
    // and specify weekday as long to get full day info and other things as numeric
    const firstDayOfMonth = new Date(year,month,1);
    // dayFirst is used to get the first of the month in order to decide the no. of total
    // padding days.
    const dayFirst = firstDayOfMonth.toLocaleDateString('en-us',{
        weekday:'long',
        year:'numeric',
        month:'numeric',
        day:'numeric'
    });
    const paddingDays = weekdays.indexOf(dayFirst.split(', ')[0]);
    console.log(paddingDays);
    // at the monthYear dive, add innertext of current month & current year;
    document.getElementById('monthYear').innerText = `${dt.toLocaleDateString('en-us',{month:'long'})} ${year}`

    calendar.innerHTML = '';
    // in order to render the boxes/squares
    for(i=1;i<=paddingDays+daysInMonth;i++){
        // created a element of type div
        const daySquare = document.createElement('div');
        // gave the css properties of square using the day class
        daySquare.classList.add('day');
        // if i>padding days , hence normal day
        if(i>paddingDays){
            // highlight current day
            if(day === i-paddingDays && nav === 0){
                daySquare.id = 'currentDay';
            }
            // set inner text(date)
            daySquare.innerText = i-paddingDays;
            // store current date
            const currDate = `${month+1}/${i-paddingDays}/${year}`;
            // check if event exists on this date
            const eventForDay = events.find(e=>e.date===currDate);
            // if yes then add this event to daysquare
            if(eventForDay){
                const eventDiv = document.createElement('div');
                eventDiv.classList.add('event');
                eventDiv.innerText = eventForDay.title;
                daySquare.appendChild(eventDiv);
            }
            // on click on daysqaure , openmodal
            daySquare.addEventListener('click',()=> openModal(currDate));
        }
        else{
            // or else , since it is a padding day , give padding wali css
            daySquare.classList.add('padding');
        }
        // in the calendar div , append the newly created div added daySquare
        calendar.appendChild(daySquare);
    }

}

// function for closing the modal 
function closeModal(){
    // set the event modal and backDrop back to none 
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    deleteEventModal.style.display = 'none';
    // set the clicked date value and input field back to none 
    clicked = null;
    eventTitleInput.value = '';
    // load the calendar again
    load();
}
// function for save event
function saveEvent(){
    // if input value exists then
    if(eventTitleInput.value){
        // remove the class error if already there
        eventTitleInput.classList.remove('error');
        // push the event in the events array
        events.push({
            date:clicked,
            title:eventTitleInput.value
        });
        // add the event into the local storage
        localStorage.setItem('events',JSON.stringify(events));
        console.log('saved in local storage');
    }
    // if input is empty then add error class
    else{
        eventTitleInput.classList.add('error');
    }
    // at end , close the modal
    closeModal();
}

function deleteEvent(){
    events = events.filter(e=>e.date!==clicked);
    localStorage.setItem('events',JSON.stringify(events));
    closeModal();
}

function initButtons(){
    document.getElementById('nextButton').addEventListener('click',()=>{
        nav++;
        load();
    });
    document.getElementById('backButton').addEventListener('click',()=>{
        nav--;
        load();
    });
    document.getElementById('reset').addEventListener('click',()=>{
        nav = 0;
        load();
    });
    document.getElementById('cancelButton').addEventListener('click',closeModal);
    document.getElementById('saveButton').addEventListener('click',saveEvent);
    document.getElementById('deleteButton').addEventListener('click',deleteEvent);
    document.getElementById('closeButton').addEventListener('click',closeModal);
}
initButtons();
// load function call initially when the javascript loads
load();