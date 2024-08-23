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
const eventExistsModal = document.getElementById('eventExistsModal');
const viewEventModal = document.getElementById('viewEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');
const switchModeBtn = document.getElementById('switchModeBtn');
const container = document.getElementById('container');
const fullNameEvent = document.getElementById('fullNameEvent');
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
        eventExistsModal.style.display = 'block';
        const eventTextElement = document.getElementById('eventText2');
        eventTextElement.innerHTML = ''; // Clear previous content

        eventForDay.events.forEach(event => {
            const eventItem = document.createElement('div');
            const fullEventTitle = event.title;
            if(event.title.length>10){
                event.title = event.title.substring(0, 10) + '...';
                const viewBtn = document.createElement('button');
                viewBtn.innerText = "View Full Event";
                viewBtn.id = 'viewButtonEvent';
                eventItem.innerText = event.title;
                eventItem.appendChild(viewBtn);
                viewBtn.addEventListener('click', () => viewEvent(fullEventTitle));
            } else{
                eventItem.innerText = event.title;
            }

            // Create delete button for each event
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = "Delete Event";
            deleteBtn.id = 'deleteButtonEvent'
            deleteBtn.addEventListener('click', () => deleteEvent(event.title));
            const editBtn = document.createElement('button');
            editBtn.innerText = "Edit Event";
            editBtn.id = 'editButtonEvent';
            editBtn.addEventListener('click', () => editEvent(event.title));
            

            eventItem.appendChild(editBtn);
            eventItem.appendChild(deleteBtn);
            eventTextElement.appendChild(eventItem);
        });
        backDrop.style.display = 'block';
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
                if(eventForDay.events[0].title.length>15) eventForDay.events[0].title.substring(0, 10) + '...';
                eventDiv.innerText = eventForDay.events[0].title;
                if(eventForDay.events[1]) eventDiv.innerText+= ' & More';
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
    eventExistsModal.style.display = 'none';
    viewEventModal.style.display = 'none';
    // set the clicked date value and input field back to none 
    clicked = null;
    eventTitleInput.value = '';
    // load the calendar again
    load();
}
// function for save event
function saveEvent(){
    eventExistsModal.style.display = 'none';
    newEventModal.style.display = 'block';
    // if input value exists then
    if(eventTitleInput.value){
        // remove the class error if already there
        eventTitleInput.classList.remove('error');
        // Find if the date already has events
        const existingEventIndex = events.findIndex(e => e.date === clicked);

        if (existingEventIndex > -1) {
            // If the date exists, push the new event to that date's array
            if (!events[existingEventIndex].events) {
                events[existingEventIndex].events = []; // Ensure 'events' is an array
            }
            events[existingEventIndex].events.push({ title: eventTitleInput.value });
        } else {
            // If the date doesn't exist, create a new entry with an array
            events.push({
                date: clicked,
                events: [{ title: eventTitleInput.value }] // Store the event in an array
            });
        }
        localStorage.setItem('events',JSON.stringify(events));
        alert('Event Sucessfully Added');
        closeModal();
        console.log('saved in local storage');
    }
    // if input is empty then add error class
    else{
        eventTitleInput.classList.add('error');
    }
}

function callCloseModal(){
    closeModal();
}

function deleteEvent(selectedEventTitle){
    const eventForDay = events.find(e => e.date === clicked);

    if (eventForDay) {
        // Filter out the selected event
        eventForDay.events = eventForDay.events.filter(event => event.title !== selectedEventTitle);

        // If no events remain for that date, remove the date entry altogether
        if (eventForDay.events.length === 0) {
            // filter the events with date which is not clicked
            events = events.filter(e => e.date !== clicked);
        }
    // events = events.filter(e=>e.date!==clicked);
        localStorage.setItem('events',JSON.stringify(events));
        alert('Event Successfully Deleted');
        closeModal();
    }
}

function editEvent(selectedEventTitle){
    const eventForDay = events.find(e => e.date === clicked);
    const eventToEdit = eventForDay.events.find(event => event.title === selectedEventTitle);
    const newTitle = prompt("Enter New Title For The Event: ");
    if(newTitle){
        eventToEdit.title = newTitle;
        localStorage.setItem('events',JSON.stringify(events));
        alert('Event Successfully Edited');
        closeModal();
    }else{
        alert("Event Title Can't Be Empty");
    }
}

function viewEvent(selectedEventTitle){
    eventExistsModal.style.display = 'none';
    fullNameEvent.innerText = selectedEventTitle;
    viewEventModal.style.display = 'block';
}

// function to close all the events of a particular date together
function deleteAllEvents(){
    // filter the events with date which is not clicked
    events = events.filter(e => e.date !== clicked);
    localStorage.setItem('events',JSON.stringify(events));
    alert('All Events Successfully Deleted');
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
    document.getElementById('addEvent').addEventListener('click',saveEvent);
    document.getElementById('deleteButton').addEventListener('click',deleteEvent);
    document.getElementById('closeButton').addEventListener('click',closeModal);
    document.getElementById('close2Button').addEventListener('click',closeModal);
    document.getElementById('close3Button').addEventListener('click',closeModal);
    document.getElementById('deleteAll').addEventListener('click',deleteAllEvents);
}
initButtons();
// load function call initially when the javascript loads
load();