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


let foo = createStudent('Foo', '1st');
foo.info();
// "Foo is a 1st year student"
foo.listCourses();
// [];
foo.addCourse({ name: 'Math', code: 101 });
foo.addCourse({ name: 'Advanced Math', code: 102 });
foo.listCourses();
// [{ name: 'Math', code: 101 }, { name: 'Advanced Math', code: 102 }]
foo.addNote(101, 'Fun course');
foo.addNote(101, 'Remember to study for algebra');
foo.viewNotes();
// "Math: Fun course; Remember to study for algebra"
foo.addNote(102, 'Difficult subject');
foo.viewNotes();
// "Math: Fun course; Remember to study for algebra"
// "Advance Math: Difficult subject"
foo.updateNote(101, 'Fun course');
foo.viewNotes();
// "Math: Fun course"
// "Advanced Math: Difficult subject"