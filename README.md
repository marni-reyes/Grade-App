# GradingApp ([GradingApp.zip](https://github.com/marni-reyes/Grade-App/files/7698030/GradingApp.zip))


**Task Description**

Eddie School teacher has always tried to be as fair as possible when judging her students at the end of
the quarter. 
She will drop the lowest (only one) homework grade from each student’s list of homework
grades. In the case of Susan Smith, she would drop the 68 because it is his lowest homework grade.

Create a simple grade-book program that reads in all the students’ names and grades, and then
computes their final averages using Eddie’s grading techniques. 

Homework grades are preceded by an ‘H’ and test grades are preceded by a ‘T’.

* The number of students and the number of grades is undetermined (but will not exceed 50).
* A student’s quarter grade is 60% of his/her test average and 40% of his/her homework average.
* A student’s final grade is the average of all recorded quarters.
* Round all quarter and final grades to the nearest tenth (83.65 would round to 83.7)
* There are 4 Quarters in a Year to save into the database. To simplify, the year is always 2021.
* The grades for the grade book can be pasted in a textarea or can be read from a file such as (grades.txt)
* Eddie may update the grades by passing the same name again.
* Eddie can clear all grades

# Links (https://gradeapp-mr.herokuapp.com/)
* Upload Grade Files
  * Allows users the upload text files that hold grades of students.
  * Assumption: The file needs the quarters to be indicated. Follows the format that the name of the student is the first part of the text line. H or T can be interchanged in the order.
  * Overwriting Rules: Uses the latest grade line for a quarter per test type (H or T) per student.
  * I have disabled the redirect for this when the upload finishes. The reason for this is the heroku connect free version (used for deployment) does not allow to update the node version they use. This part works locally on my machine to redirect to the main page. Kindly just refer back to https://gradeapp-mr.herokuapp.com/ once the upload finishes. If you want to try locally kindly use the VS solution attached on this Readme ([GradingApp.zip](https://github.com/marni-reyes/Grade-App/files/7698030/GradingApp.zip)). Issue was indicated on this version: https://github.com/npm/npm/issues/19989
* Input Grade Text
  * Allows users to input text that hold grades of students.
  * Assumption: The text needs the quarters to be indicated. Follows the format that the name of the student is the first part of the text line. H or T can be interchanged.
  * Overwriting Rules: Uses the latest grade line for a quarter per test type (H or T) per student.
* Show Grades
  * Shows the grade of the students.
* Clear Grades
  * Clears all the grades of students.
  
# Database Definitions
* Database Folder in the Git holds Database Objects Definitions. 
* Tables
  * grades_raw - table used to process input from users
  * student - processed to hold student data
  * grades - processed to hold grade data
* Views
  * vw_grades - view of calculated grades (removes lowest homework score)
* Stored Procedures
  * sp_clear_tables - clears all tables. used to clear data of students.
  * sp_populate_tables - used to populate student and grades table from grades_raw
