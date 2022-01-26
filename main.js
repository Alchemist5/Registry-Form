const firstName = document.querySelector('#first-name')
const lastName = document.querySelector('#last-name')
const regNo = document.querySelector('#reg-no')
const course = document.querySelector('#course')
const email = document.querySelector('#email')
const idNo = document.querySelector('#id-no');
const btn = document.querySelector('.btn');
const filter = document.querySelector('#filter');
const studentItem = document.querySelector('#studentItem')

document.addEventListener('DOMContentLoaded', () => {
// Get & Display students in UI
    let students;
    if(localStorage.getItem('Students') !== null) {
        students = JSON.parse(localStorage.getItem('Students'));

        students.forEach(student => {
            document.querySelector('tbody').innerHTML += `
            <tr id="studentItem"> 
                 <td class="first-name">${student.firstName}</td> 
                 <td>${student.lastName}</td> 
                 <td>${student.RegistrationNumber}</td> 
                 <td>${student.courseName}</td> 
                 <td>${student.email}</td> 
                 <td>${student.IDNo}</td> 
                 <td class="delete">Delete</td> 
            </tr>
        `
        })
    }
})

btn.addEventListener('click', () => {

    if(firstName.value !== '' && lastName.value !== '' && regNo.value !== '' && course.value !== '' && email.value !== '' && idNo.value !== '') {

            let students;
        if(localStorage.getItem('Students') !== null && JSON.parse(localStorage.getItem('Students') != [])) {
            students = JSON.parse(localStorage.getItem('Students'));

            students.forEach(student => {
            if(firstName.value !== student.firstName && lastName.value !== student.lastName && regNo.value !== student.RegistrationNumber && email.value !== student.email && idNo.value !== student.IDNo){

                // Instantiate Students
            const students = new Students(firstName.value,lastName.value,regNo.value,course.value,email.value,idNo.value);
            
            // Add Students to List
            students.addStudentsToList();

            // Add Students to Local Storage
            students.addStudentsToLocalStorage();

            // Instantatiate UI
            const ui = new UI();

            ui.showMessage('Student Added Successfully!','success')
            ui.clearInput();

            } else {
                // Instantatiate UI
                const ui = new UI();
                ui.showMessage('Student already exists!','error')
            }
        })
    } else {
        // Instantiate Students
        const students = new Students(firstName.value,lastName.value,regNo.value,course.value,email.value,idNo.value);
        
        // Add Students to List
        students.addStudentsToList();

        // Add Students to Local Storage
        students.addStudentsToLocalStorage();

        // Instantatiate UI
        const ui = new UI();

        ui.showMessage('Student Added Successfully!','success')
        ui.clearInput();
    }

        
    } else {

        const ui = new UI();
        ui.showMessage('Please fill all fields', 'error')
        
    }
});

filter.addEventListener('keyup', () => {
    const text = filter.value.toLowerCase();
    const firstnames = document.querySelectorAll('.first-name');

    firstnames.forEach(firstname => {
        const name = firstname.textContent
        if(name.toLowerCase().indexOf(text) != -1) {
            console.log(firstname.textContent);
            firstname.parentElement.style.display = 'table-row'
        } else {
            firstname.parentElement.style.display = 'none'
        }
    })
})

document.querySelector('tbody').addEventListener('click', (e) => {
    // Instantatiate UI
    const ui = new UI();

    ui.deleteStudentFromList(e);
})

class Students {
    constructor(firstName,lastName,regNo,course,email,idNo) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.regNo = regNo;
        this.course = course;
        this.email = email;
        this.idNo = idNo;
    }

    addStudentsToList() {

        document.querySelector('tbody').innerHTML += `
            <tr id="studentItem"> 
                 <td class ="first-name">${this.firstName}</td> 
                 <td>${this.lastName}</td> 
                 <td>${this.regNo}</td> 
                 <td>${this.course}</td> 
                 <td>${this.email}</td> 
                 <td>${this.idNo}</td> 
                 <td class ="delete">Delete</td> 
            </tr>
        `

    }

    addStudentsToLocalStorage() {
        const studentData = {
            firstName : this.firstName,
            lastName : this.lastName,
            RegistrationNumber : this.regNo,
            courseName : this.course,
            email : this.email,
            IDNo : this.idNo
        }

        let students;

        if(localStorage.getItem('Students') === null) {
            students = []
        } else {
            students = JSON.parse(localStorage.getItem('Students'));
        }

        students.push(studentData)
        localStorage.setItem('Students', JSON.stringify(students))
    }

}

class UI {
    
    showMessage(msg,className) {
        this.clearMessage();
        const div = document.createElement('div');
        div.className = `message ${className}`;
        div.appendChild(document.createTextNode(msg))

        if(div.classList.contains('delete')) {
            const database = document.querySelector('.database');
            const table = document.querySelector('table');

            database.insertBefore(div,table);
        } else {
            const form = document.querySelector('.form');
            const formTitle = document.querySelector('.form-title');

            form.insertBefore(div,formTitle);
        }

        
        setTimeout(this.clearMessage,2400)
    }

    clearMessage() {
        if(document.querySelector('.message')) {
            document.querySelector('.message').remove();
        } else if( document.querySelector('.error')){
            document.querySelector('.error').remove();
        }else if(document.querySelector('.delete-msg')){
            document.querySelector('.delete-msg').remove();
        }
    }

    deleteStudentFromList(e) {
        if(e.target.classList.contains('delete')) {
            if(confirm('Are you sure?')) {
                e.target.parentElement.remove();
            }

            this.showMessage('Student deleted', 'delete');

            this.removeDeletedStudentFromLS(e.target.previousSibling.previousSibling.innerText);
        }  
    }

    removeDeletedStudentFromLS(idNo) {
        let students;
        if(localStorage.getItem('Students') !== null) {
            students = JSON.parse(localStorage.getItem('Students'));

            students.forEach((student,index) => {
                if(idNo === student.IDNo) {
                    students.splice(index,1)
                }
            })
        }

        localStorage.setItem('Students', JSON.stringify(students))

        // if(JSON.parse(localStorage.getItem('Students') === [])) {
        //             localStorage.removeItem('Students')
        //     } else {
        //         localStorage.setItem('Students', JSON.stringify(students))
        //     }
    }

    clearInput() {
        firstName.value = '';
        lastName.value = '';
        regNo.value = '';
        course.value = '';
        idNo.value = '';
        email.value = '';
    }
}