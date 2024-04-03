// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDshsAdDZCUWtEriwu2sdwVKlEScBRli3Y",
  authDomain: "gbuild-login.firebaseapp.com",
  databaseURL: "https://gbuild-login-default-rtdb.firebaseio.com",
  projectId: "gbuild-login",
  storageBucket: "gbuild-login.appspot.com",
  messagingSenderId: "64427327236",
  appId: "1:64427327236:web:71e7d5f7486109e5f7da51",
  measurementId: "G-P6CS2QXHYQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
  // Initialize Firebase
  const database = firebase.database();

  // Dynamically populate subjects and semesters from Firebase
  database.ref('subjects').on('value', (snapshot) => {
      const subjectsDropdown = document.querySelector('.dropdown-menu:first-child');
      subjectsDropdown.innerHTML = ''; // Clear existing options
      snapshot.forEach((childSnapshot) => {
          const subjectName = childSnapshot.val();
          const option = document.createElement('li');
          option.innerHTML = `<a class="dropdown-item" href="#">${subjectName}</a>`;
          subjectsDropdown.appendChild(option);
      });
  });

  database.ref('semesters').on('value', (snapshot) => {
      const semestersDropdown = document.querySelector('.dropdown-menu:last-child');
      semestersDropdown.innerHTML = ''; // Clear existing options
      snapshot.forEach((childSnapshot) => {
          const semesterName = childSnapshot.val();
          const option = document.createElement('li');
          option.innerHTML = `<a class="dropdown-item" href="#">${semesterName}</a>`;
          semestersDropdown.appendChild(option);
      });
  });

  // Add score functionality
  const addScoreBtn = document.getElementById('addScoreBtn');
  addScoreBtn.addEventListener('click', () => {
      const subject = document.querySelector('.dropdown-menu:first-child .dropdown-item.active').textContent;
      const semester = document.querySelector('.dropdown-menu:last-child .dropdown-item.active').textContent;
      const marks = document.getElementById('marksInput').value;

      // Validate input
      if (!subject || !semester || !marks) {
          alert('Please select a subject, semester, and enter marks.');
          return;
      }

      // Add score to Firebase
      database.ref('users/userId1/courses').push({
          name: subject,
          semester: semester,
          testScores: {
              // Generate a unique test ID
              testId: database.ref('users/userId1/courses').push().key,
              score: marks,
              date: new Date().toISOString()
          }
      });

      // Clear input fields
      document.getElementById('marksInput').value = '';
  });

  // Display test scores from Firebase
  database.ref('users/userId1/courses').on('value', (snapshot) => {
      const scoreTableBody = document.getElementById('scoreTableBody');
      scoreTableBody.innerHTML = ''; // Clear existing scores

      let count = 1;
      snapshot.forEach((childSnapshot) => {
          const course = childSnapshot.val();
          const testScores = course.testScores;

          for (const testId in testScores) {
              const testScore = testScores[testId];
              const row = document.createElement('tr');
              row.innerHTML = `
                  <th scope="row">${count++}</th>
                  <td>${course.name}</td>
                  <td>${course.semester}</td>
                  <td>${testScore.score}</td>
                  <td>
                      <button class="btn btn-danger btn-sm delete-score" data-test-id="${testId}">Delete</button>
                  </td>
              `;
              scoreTableBody.appendChild(row);
          }
      });

      // Add event listeners for delete buttons
      const deleteScoreBtns = document.querySelectorAll('.delete-score');
      deleteScoreBtns.forEach((btn) => {
          btn.addEventListener('click', (e) => {
              const testId = e.target.dataset.testId;
              database.ref(`users/userId1/courses/${childSnapshot.key}/testScores/${testId}`).remove();
          });
      });
  });