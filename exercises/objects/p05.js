let school = {
  students: [],

  addStudent: function(name, year) {
    if (['1st', '2nd', '3rd', '4th', '5th'].includes(year)) {
      let student = createStudent(name, year);
      this.students.push(student);
      return student;
    } else {
      console.log('Invalid year');
    }
  },

  enrollStudent: function(student, courseName, courseCode) {
    student.addCourse({name: courseName, code: courseCode});
  },

  addGrade(student, courseCode, grade) {
    let course =
      student.courses.filter( course => course.code === courseCode)[0];
    course['grade'] = grade;
  },

  getReportCard(student) {
    student.courses.forEach(course => {
      let grade = course.hasOwnProperty('grade') ? course.grade : "In progress";
      console.log(`${course.name}: ${grade}`);
    });
  },

  courseReport(courseName) {
    let grades = [];

    this.students.forEach(student => {
      let course =
        student.courses.filter( course => course.name === courseName)[0];

      if (course && course.hasOwnProperty('grade')) {
        grades.push([student.studname, course.grade]);
      }
    });

    if (grades.length === 0) console.log('undefined');
    else {
      console.log(`=${courseName} grades=`);
      grades.forEach(elem => console.log(`${elem[0]}: ${elem[1]}`));
      let avg = grades.reduce((pre, cur) => pre + cur[1], 0) / grades.length;
      console.log('---');
      console.log(`Course Average: ${avg.toFixed(0)}`);
    }
  }
};

// eslint-disable-next-line max-lines-per-function
function createStudent(studname, year) {
  return {
    studname: studname,
    year: year,
    courses: [],
    info() {
      console.log(`${this.studname} is a ${this.year} student`);
    },

    listCourses() {
      console.log(this.courses);
    },

    addCourse(course) {
      this.courses.push(course);
    },

    addNote(courseNum, courseNote) {
      let course = this.courses.filter( course => course.code === courseNum)[0];
      if (course.hasOwnProperty('note')) {
        course['note'] += '; ' + courseNote;
      } else {
        course['note'] = courseNote;
      }
    },

    viewNotes() {
      this.courses.forEach(course => {
        if (course.hasOwnProperty('note')) {
          console.log(`${course.name}: ${course.note}`);
        }
      });
    },

    updateNote(courseNum, courseNote) {
      let course = this.courses.filter(course => course.code === courseNum)[0];
      course['note'] = courseNote;
    }
  };
}

let foo = school.addStudent('foo','3rd');
school.enrollStudent(foo, 'Math', 101);
school.addGrade(foo, 101, 95);
school.enrollStudent(foo, 'Advanced Math', 102);
school.addGrade(foo, 102, 90);
school.enrollStudent(foo, 'Physics', 202);

let bar = school.addStudent('bar', '1st');
school.enrollStudent(bar, 'Math', 101);
school.addGrade(bar, 101, 91);

let qux = school.addStudent('qux', '2nd');
school.enrollStudent(qux, 'Math', 101);
school.addGrade(qux, 101, 93);
school.enrollStudent(qux, 'Advanced Math', 102);
school.addGrade(qux, 102, 90);

school.getReportCard(foo);
school.courseReport('Math');
school.courseReport('Advanced Math');
school.courseReport('Physics');