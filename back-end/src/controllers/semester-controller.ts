import express from "express";
import { BaseController } from "./abstractions/base-controller";
import asyncHandler from "express-async-handler";
import prisma from "../../prisma/prisma";
import { verifyAccessToken } from "../middlewares/verifyToken";
const getDayInWeek = (date: any) => {
  // Tạo một đối tượng Date từ chuỗi thời gian

  // Mảng chứa các tên thứ
  var daysOfWeek = [
    "Chủ Nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  // Lấy số thứ từ đối tượng Date
  var dayIndex = date.getUTCDay();

  // Lấy tên thứ tương ứng từ mảng daysOfWeek
  var dayName = daysOfWeek[dayIndex];

  return dayName; // Kết quả: "Thứ Hai" (hoặc tùy theo ngày bạn nhập)
};
const getDate = (date: any) => {
  // Lấy ngày, tháng và năm
  var day = String(date.getUTCDate()).padStart(2, "0"); // Sử dụng padStart để đảm bảo ngày có 2 chữ số
  var month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Sử dụng padStart để đảm bảo tháng có 2 chữ số
  var year = date.getUTCFullYear();

  // Định dạng lại thành chuỗi ngày/tháng/năm
  var formattedDate = day + "/" + month + "/" + year;

  return formattedDate; // Kết quả: "03/04/2024"
};
const getHHMMSS = (date: any) => {
  //console.log(date);
  var hours = date.getUTCHours();
  var minutes = date.getUTCMinutes();
  var seconds = date.getUTCSeconds();
  //console.log(hours, minutes, seconds);
  // Đảm bảo giờ, phút và giây luôn hiển thị 2 chữ số
  var formattedTime =
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  return formattedTime; // Kết quả: "03:04:26"
};
class SemesterController extends BaseController {
  public path = "/semester";

  constructor() {
    super();
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.createSemester);
    this.router.get(this.path, this.getAllSemester);
    this.router.get(
      `${this.path}/user`,
      [verifyAccessToken],
      this.getCourseResultInSemester,
    );
    this.router.get(`${this.path}/now`, this.getSemesterByNow);
    this.router.post(`${this.path}/dkmh`, this.createNewDKMHForSemester);
    this.router.get(
      `${this.path}/dkmh/now`,
      [verifyAccessToken],
      this.getDKMHByNow,
    );
    this.router.get(`${this.path}/tkb`, [verifyAccessToken], this.getTKB);
    this.router.get(
      `${this.path}/schedule`,
      [verifyAccessToken],
      this.getSchedule,
    );
    this.router.get(
      `${this.path}/calendar`,
      [verifyAccessToken],
      this.getCalendar,
    );
    this.router.get(
      `${this.path}/quiz-submit`,
      [verifyAccessToken],
      this.getQuizAndSubmissionTime,
    );
    // Bạn có thể thêm put, patch, delete sau.
  }
  private createSemester = asyncHandler(
    async (request: any, response: express.Response) => {
      if (!request.body.description) throw new Error("Description is required");
      const { description } = request.body;
      const createdSemester = await prisma.semester.create({
        data: {
          description,
          start_date: new Date(),
          // end_date - start_date = 4 months
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 4)),
        },
      });
      if (!createdSemester) throw new Error("Cannot create category");
      response.json({
        message: "Created new semester",
        data: createdSemester,
      });
    },
  );
  private getAllSemester = asyncHandler(
    async (request: any, response: express.Response) => {
      const semesters = await prisma.semester.findMany();
      response.json({
        success: true,
        message: "Get all semesters",
        data: semesters,
      });
    },
  );
  private getCourseResultInSemester = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id } = request.query;
      const course_result = await prisma.courseResult.findMany({
        where: {
          course: {
            semesterId: id,
          },
          userId: request.user._id,
        },
        select: {
          id: true,
          score_array: true,
          average_score: true,
          course: {
            select: {
              id: true,
              title: true,
              name_factor: true,
              score_factor: true,
              credit: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
      response.json({
        success: true,
        message: "Get all courses in semester",
        data: course_result,
      });
    },
  );
  private getSemesterByNow = asyncHandler(
    async (request: any, response: express.Response) => {
      const now = new Date();
      const semester = await prisma.semester.findFirst({
        where: {
          start_date: {
            lte: now,
          },
          end_date: {
            gte: now,
          },
        },
      });
      response.json({
        success: true,
        message: "Get semester by now",
        data: semester,
      });
    },
  );
  private createNewDKMHForSemester = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id, title, start_date, end_date } = request.body;
      const dkmh = await prisma.dKMH.create({
        data: {
          title,
          semesterId: id,
          start_date: start_date ? start_date : new Date(),
          // end_date - start_date = 1 week
          end_date: end_date
            ? end_date
            : new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      });
      if (!dkmh) throw new Error("Cannot create DKMH");
      response.json({
        success: true,
        message: "Create new DKMH for semester",
        data: dkmh,
      });
    },
  );
  private getDKMHByNow = asyncHandler(
    async (request: any, response: express.Response) => {
      const now = new Date();
      const dkmh: any = await prisma.dKMH.findFirst({
        where: {
          start_date: {
            lte: now,
          },
          end_date: {
            gte: now,
          },
        },
        select: {
          id: true,
          title: true,
          start_date: true,
          end_date: true,
          semester: {
            select: {
              id: true,
              description: true,
              courses: {
                select: {
                  id: true,
                  title: true,
                  date: true,
                  schedule: true,
                  time: true,
                  usersId: true,
                  _count: {
                    select: {
                      users: true,
                    },
                  },
                  quantity: true,
                  course_id: true,
                },
              },
            },
          },
        },
      });
      for (let i = 0; i < dkmh.semester.courses.length; i++) {
        if (dkmh.semester.courses[i].usersId.includes(request.user._id)) {
          dkmh.semester.courses[i].usersId = true;
        } else {
          dkmh.semester.courses[i].usersId = false;
        }
      }
      response.json({
        success: true,
        message: "Get DKMH by now",
        data: dkmh,
      });
    },
  );
  private getTKB = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id } = request.query;
      // console.log(request.query);
      const tkb: any = [[], [], [], [], [], []];
      // tạo mảng chứa các môn học của học kỳ theo ngày trong tuần
      const dkmh: any = await prisma.semester.findFirst({
        where: {
          id,
        },
        select: {
          courses: {
            where: {
              usersId: {
                has: request.user._id,
              },
            },
            select: {
              title: true,
              date: true,
              schedule: true,
              time: true,
              course_id: true,
              credit: true,
            },
          },
        },
      });
      for (let i = 0; i < dkmh.courses.length; i++) {
        if (dkmh.courses[i].date == "Monday") {
          tkb[0].push({
            credit: dkmh?.courses[i].credit,
            course_id: dkmh?.courses[i].course_id,
            title: dkmh?.courses[i].title,
            schedule: dkmh?.courses[i].schedule,
            time: dkmh?.courses[i].time,
          });
        } else if (dkmh.courses[i].date == "Tuesday") {
          tkb[1].push({
            credit: dkmh?.courses[i].credit,
            course_id: dkmh?.courses[i].course_id,
            title: dkmh?.courses[i].title,
            schedule: dkmh?.courses[i].schedule,
            time: dkmh?.courses[i].time,
          });
        } else if (dkmh.courses[i].date == "Wednesday") {
          tkb[2].push({
            credit: dkmh?.courses[i].credit,
            course_id: dkmh?.courses[i].course_id,
            title: dkmh?.courses[i].title,
            schedule: dkmh?.courses[i].schedule,
            time: dkmh?.courses[i].time,
          });
        }
        if (dkmh.courses[i].date == "Thursday") {
          tkb[3].push({
            credit: dkmh?.courses[i].credit,
            course_id: dkmh?.courses[i].course_id,
            title: dkmh?.courses[i].title,
            schedule: dkmh?.courses[i].schedule,
            time: dkmh?.courses[i].time,
          });
        }
        if (dkmh.courses[i].date == "Friday") {
          tkb[4].push({
            credit: dkmh?.courses[i].credit,
            course_id: dkmh?.courses[i].course_id,
            title: dkmh?.courses[i].title,
            schedule: dkmh?.courses[i].schedule,
            time: dkmh?.courses[i].time,
          });
        }
        if (dkmh.courses[i].date == "Saturday") {
          tkb[5].push({
            credit: dkmh?.courses[i].credit,
            course_id: dkmh?.courses[i].course_id,
            title: dkmh?.courses[i].title,
            schedule: dkmh?.courses[i].schedule,
            time: dkmh?.courses[i].time,
          });
        }
      }
      response.json({
        success: true,
        message: "Get TKB by DKMH",
        data: tkb,
      });
    },
  );
  private getSchedule = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id } = request.query;
      const start = await prisma.semester.findFirst({
        where: {
          id,
        },
        select: {
          start_date: true,
        },
      });

      if (!start) throw new Error("Wrong semester!");
      const currentDate = new Date();
      // console.log(currentDate);
      const now = getDayInWeek(currentDate) + ", " + getDate(currentDate);
      const week = Math.ceil(
        (Number(currentDate) - Number(start.start_date)) /
          (60 * 60 * 24 * 7 * 1000),
      );
      const course = await prisma.course.findMany({
        where: {
          semesterId: id,
          usersId: { has: request.user._id },
          schedule: {
            has: week,
          },
        },
        select: {
          title: true,
          time: true,
          date: true,
        },
      });
      const Week: any = [[], [], [], [], [], [], []];
      for (let i = 0; i < course.length; i++) {
        if (course[i].date == "Monday") {
          Week[0].push({
            title: course[i].title,
            time: course[i].time,
          });
        } else if (course[i].date == "Tuesday") {
          Week[1].push({
            title: course[i].title,
            time: course[i].time,
          });
        } else if (course[i].date == "Wednesday") {
          Week[2].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
        if (course[i].date == "Thursday") {
          Week[3].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
        if (course[i].date == "Friday") {
          Week[4].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
        if (course[i].date == "Saturday") {
          Week[5].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
      }
      if (!course) throw new Error("Cannot find schedule!");

      response.json({
        success: true,
        mess: "Get schedule successfully",
        data: {
          schedule: Week,
          index: week,
          now,
        },
      });
    },
  );
  private getCalendar = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id } = request.query;
      const Week: any = [[], [], [], [], [], [], []];
      const week = Number(request.query.week);
      const semester: any = await prisma.semester.findFirst({
        where: {
          id,
        },
        select: {
          start_date: true,
          end_date: true,
        },
      });
      let course: any = await prisma.course.findMany({
        where: {
          semesterId: id,
          usersId: { has: request.user._id },
          schedule: {
            has: week,
          },
        },
        select: {
          title: true,
          time: true,
          date: true,
          // DocumentSections: {
          //   select: {
          //     id: true,
          //     quiz: {
          //       select: {
          //         id: true,
          //         title: true,
          //         start_date: true,
          //         end_date: true,
          //       },
          //     },
          //     submissions: {
          //       select: {
          //         id: true,
          //         start_date: true,
          //         end_date: true,
          //         description: true,
          //       },
          //     },
          //   }
          //}
        },
      });
      const quiz = await prisma.quiz.findMany({
        where: {
          documentSection: {
            course: {
              semesterId: id,
            },
          },
        },
      });
      // for (let i = 0; i < quiz.length; i++) {
      //   console.log(quiz[i]);
      // }
      const num_week = Math.ceil(
        (Number(semester.end_date) - Number(semester.start_date)) /
          (60 * 60 * 24 * 7 * 1000),
      );
      const index_start = getDayInWeek(semester.start_date);
      const index_end = getDayInWeek(semester.end_date);
      const start_day = new Date(
        Number(semester.start_date) + (week - 1) * 7 * 24 * 60 * 60 * 1000,
      );
      const end_day = new Date(
        semester.start_date + (week + 1) * 7 * 24 * 60 * 60 * 1000,
      );
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      for (let i = 0; i < course.length; i++) {
        //   for (let j = 0; j < course[i].DocumentSections.length; j ++){
        //     if (course[i].DocumentSections[j].quiz) {
        //       for (let k = 0; k < course[i].DocumentSections[j].quiz.length; k++) {
        //         let startIndex =  course[i].DocumentSections[j].quiz[k].start_date.getDay();
        //         let endIndex =  course[i].DocumentSections[j].quiz[k].end_date.getDay();
        //         course[i].DocumentSections[j].quiz[k].start_date = daysOfWeek[startIndex];
        //         course[i].DocumentSections[j].quiz[k].end_date = daysOfWeek[endIndex];
        //       }
        //     }
        //     if (course[i].DocumentSections[j].submissions) {
        //       for (let k = 0; k < course[i].DocumentSections[j].submissions.length; k++) {
        //         let startIndex =  course[i].DocumentSections[j].submissions[k].start_date.getDay();
        //         let endIndex =  course[i].DocumentSections[j].submissions[k].end_date.getDay();
        //         course[i].DocumentSections[j].submissions[k].start_date = daysOfWeek[startIndex];
        //         course[i].DocumentSections[j].submissions[k].end_date = daysOfWeek[endIndex];
        //       }
        //     }
        //   }
        if (course[i].date == "Monday") {
          Week[0].push({
            title: course[i].title,
            time: course[i].time,
          });
        } else if (course[i].date == "Tuesday") {
          Week[1].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
        if (course[i].date == "Wednesday") {
          Week[2].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
        if (course[i].date == "Thursday") {
          Week[3].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
        if (course[i].date == "Friday") {
          Week[4].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
        if (course[i].date == "Saturday") {
          Week[5].push({
            title: course[i].title,
            time: course[i].time,
          });
        }
      }
      response.json({
        success: true,
        message: "Get calendar",
        data: {
          course,
          quiz,
          Week,
          week,
          num_week,
          start_day,
          end_day,
          index_start,
          index_end,
        },
      });
    },
  );
  private getQuizAndSubmissionTime = asyncHandler(
    async (request: any, response: express.Response) => {
      const { id, date_filter, name_filter, type_filter } = request.query;
      console.log(request.query);
      let quiz: any = null;
      let submit: any = null;
      let result: any = [];
      // date_filter : 1 - hiện tại, 2 - 7 ngày tiếp theo, 3 - 30 ngày tiếp theo, 4 - 60 ngày tiếp theo
      // type_filter : 1 - sắp xếp theo ngày, 2 - sắp xếp theo môn học
      const now = new Date();
      const current = new Date();
      let end_date;
      switch (date_filter) {
        case "1":
          end_date = new Date(now.setDate(now.getDate()));
          break;
        case "2":
          end_date = new Date(now.setDate(now.getDate() + 7));
          break;
        case "3":
          end_date = new Date(now.setDate(now.getDate() + 30));
          break;
        case "4":
          end_date = new Date(now.setDate(now.getDate() + 60));
          break;
        default:
          break;
      }
      if (type_filter == "1") {
        submit = await prisma.submission.findMany({
          where: {
            documentSection: {
              course: {
                semesterId: id,
                usersId: { has: request.user._id },
              },
            },
            title: {
              contains: name_filter,
            },
            end_date: {
              lte: end_date,
              gte: current,
            },
          },
          orderBy: {
            end_date: "asc",
          },
          select: {
            id: true,
            title: true,
            end_date: true,
            documentSection: {
              select: {
                course: {
                  select: {
                    title: true,
                    course_id: true,
                    // select user has role teacher
                    users: {
                      where: {
                        role: "TEACHER",
                      },
                      select: {
                        firstname: true,
                        lastname: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });
        quiz = await prisma.quiz.findMany({
          where: {
            documentSection: {
              course: {
                semesterId: id,
                usersId: { has: request.user._id },
              },
            },
            title: {
              contains: name_filter,
            },
            end_date: {
              lte: end_date,
              gte: current,
            },
          },
          orderBy: {
            end_date: "asc",
          },
          select: {
            id: true,
            title: true,
            end_date: true,
            documentSection: {
              select: {
                course: {
                  select: {
                    title: true,
                    course_id: true,
                    // select user has role teacher
                    users: {
                      where: {
                        role: "TEACHER",
                      },
                      select: {
                        firstname: true,
                        lastname: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        // [
        //   {
        //     date : "Chủ Nhật, 03/04/2024",
        //     quiz : [
        //       {
        //}
        //]
        for (let i = 0; i < quiz.length; i++) {
          const end = quiz[i].end_date;
          quiz[i].end_date = getDayInWeek(end) + ", " + getDate(end);
          quiz[i].end_time = getHHMMSS(end);
        }
        for (let i = 0; i < submit.length; i++) {
          const end = submit[i].end_date;
          submit[i].end_date = getDayInWeek(end) + ", " + getDate(end);
          submit[i].end_time = getHHMMSS(end);
        }
        // gộp các quiz có end_date giống nhau
        for (let i = 0; i < quiz.length; i++) {
          let check = false;
          for (let j = 0; j < result.length; j++) {
            if (quiz[i].end_date == result[j].date) {
              if (!result[j].quiz) result[j].quiz = [];
              result[j].quiz.push({
                id: quiz[i].id,
                title: quiz[i].title,
                end_time: quiz[i].end_time,
                course_title: quiz[i].documentSection.course.title,
                course_id: quiz[i].documentSection.course.course_id,
                course_teacher:
                  quiz[i].documentSection.course.users[0].firstname +
                  " " +
                  quiz[i].documentSection.course.users[0].lastname,
              });
              check = true;
              break;
            }
          }
          if (!check) {
            result.push({
              date: quiz[i].end_date,
              quiz: [
                {
                  id: quiz[i].id,
                  title: quiz[i].title,
                  end_time: quiz[i].end_time,
                  course_title: quiz[i].documentSection.course.title,
                  course_id: quiz[i].documentSection.course.course_id,
                  course_teacher:
                    quiz[i].documentSection.course.users[0].firstname +
                    " " +
                    quiz[i].documentSection.course.users[0].lastname,
                },
              ],
            });
          }
        }
        for (let i = 0; i < submit.length; i++) {
          let check = false;
          for (let j = 0; j < result.length; j++) {
            if (submit[i].end_date == result[j].date) {
              //console.log(submit[i].end_date, result[j].date);
              if (!result[j].submissions) result[j].submissions = [];
              result[j].submissions.push({
                id: submit[i].id,
                title: submit[i].title,
                end_time: submit[i].end_time,
                course_title: submit[i].documentSection.course.title,
                course_id: submit[i].documentSection.course.course_id,
                course_teacher:
                  submit[i].documentSection.course.users[0].firstname +
                  " " +
                  submit[i].documentSection.course.users[0].lastname,
              });
              check = true;
              break;
            }
          }
          if (!check) {
            result.push({
              date: submit[i].end_date,
              submissions: [
                {
                  id: submit[i].id,
                  title: submit[i].title,
                  end_time: submit[i].end_time,
                  course_title: submit[i].documentSection.course.title,
                  course_id: submit[i].documentSection.course.course_id,
                  course_teacher:
                    submit[i].documentSection.course.users[0].firstname +
                    " " +
                    submit[i].documentSection.course.users[0].lastname,
                },
              ],
            });
          }
        }
      } else {
        result = await prisma.course.findMany({
          where: {
            semesterId: id,
            usersId: { has: request.user._id },
          },
          select: {
            title: true,
            date: true,
            course_id: true,
            users: {
              where: {
                role: "TEACHER",
              },
              select: {
                firstname: true,
                lastname: true,
              },
            },
            DocumentSections: {
              select: {
                id: true,
                submissions: {
                  where: {
                    end_date: {
                      lte: end_date,
                      gte: current,
                    },
                    title: {
                      contains: name_filter,
                    },
                  },
                  select: {
                    id: true,
                    title: true,
                    end_date: true,
                    description: true,
                  },
                },
                quiz: {
                  where: {
                    title: {
                      contains: name_filter,
                    },
                    end_date: {
                      lte: end_date,
                      gte: current,
                    },
                  },
                  select: {
                    id: true,
                    title: true,
                    end_date: true,
                  },
                },
              },
            },
          },
        });
        // console.log(result);
        result = result.filter((item: any) => {
          if (item.DocumentSections.length > 0) {
            for (let i = 0; i < item.DocumentSections.length; i++) {
              if (
                item.DocumentSections[i].quiz.length > 0 ||
                item.DocumentSections[i].submissions.length > 0
              ) {
                return true;
              }
            }
          } else return false;
        });
        // chuyển end_date từ dạng timestamp sang dạng ngày tháng năm và giờ phút giây
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].DocumentSections.length; j++) {
            for (
              let k = 0;
              k < result[i].DocumentSections[j].quiz.length;
              k++
            ) {
              const end = result[i].DocumentSections[j].quiz[k].end_date;
              result[i].DocumentSections[j].quiz[k].end_date =
                getDayInWeek(end) + ", " + getDate(end);
              result[i].DocumentSections[j].quiz[k].end_time = getHHMMSS(end);
            }
            for (
              let k = 0;
              k < result[i].DocumentSections[j].submissions.length;
              k++
            ) {
              const end = result[i].DocumentSections[j].submissions[k].end_date;
              result[i].DocumentSections[j].submissions[k].end_date =
                getDayInWeek(end) + ", " + getDate(end);
              result[i].DocumentSections[j].submissions[k].end_time =
                getHHMMSS(end);
            }
          }
        }
        // // gộp các quiz có end_date giống nhau
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].users.length; j++) {
            result[i].course_teacher =
              result[i].users[j].firstname +
              " " +
              result[i].users[j].lastname +
              "_";
          }
          result[i].quiz = [];
          result[i].submissions = [];
          for (let k = 0; k < result[i].DocumentSections.length; k++) {
            if (result[i].DocumentSections[k].quiz.length > 0) {
              for (
                let n = 0;
                n < result[i].DocumentSections[k].quiz.length;
                n++
              ) {
                let check = false;
                for (let j = 0; j < result[i].quiz.length; j++) {
                  if (
                    result[i].DocumentSections[k].quiz[n].end_date ==
                    result[i].quiz[j].date
                  ) {
                    result[i].quiz[j].quiz.push({
                      id: result[i].DocumentSections[k].quiz[n].id,
                      title: result[i].DocumentSections[k].quiz[n].title,
                      end_time: result[i].DocumentSections[k].quiz[n].end_time,
                      course_title: result[i].title,
                      course_id: result[i].course_id,
                      course_teacher: result[i].course_teacher,
                    });
                    check = true;
                    break;
                  }
                }
                if (!check) {
                  result[i].quiz.push({
                    date: result[i].DocumentSections[k].quiz[n].end_date,
                    quiz: [
                      {
                        id: result[i].DocumentSections[k].quiz[n].id,
                        title: result[i].DocumentSections[k].quiz[n].title,
                        end_time:
                          result[i].DocumentSections[k].quiz[n].end_time,
                        course_title: result[i].title,
                        course_id: result[i].course_id,
                        course_teacher: result[i].course_teacher,
                      },
                    ],
                  });
                }
              }
            }
            if (result[i].DocumentSections[k].submissions.length > 0) {
              for (
                let n = 0;
                n < result[i].DocumentSections[k].submissions.length;
                n++
              ) {
                let check = false;
                for (let j = 0; j < result[i].submissions.length; j++) {
                  if (
                    result[i].DocumentSections[k].submissions[n].end_date ==
                    result[i].submissions[j].date
                  ) {
                    result[i].submissions[j].submissions.push({
                      id: result[i].DocumentSections[k].submissions[n].id,
                      title: result[i].DocumentSections[k].submissions[n].title,
                      end_time:
                        result[i].DocumentSections[k].submissions[n].end_time,
                      course_title: result[i].title,
                      course_id: result[i].course_id,
                      course_teacher: result[i].course_teacher,
                    });
                    check = true;
                    break;
                  }
                }
                if (!check) {
                  result[i].submissions.push({
                    date: result[i].DocumentSections[k].submissions[n].end_date,
                    submissions: [
                      {
                        id: result[i].DocumentSections[k].submissions[n].id,
                        title:
                          result[i].DocumentSections[k].submissions[n].title,
                        end_time:
                          result[i].DocumentSections[k].submissions[n].end_time,
                        course_title: result[i].title,
                        course_id: result[i].course_id,
                        course_teacher: result[i].course_teacher,
                      },
                    ],
                  });
                }
              }
            }
          }
          delete result[i].DocumentSections;
          delete result[i].users;
        }
        // lọc ra các course có quiz hoặc submission khác rỗng
      }

      response.json({
        success: true,
        message: "Get quiz and submission",
        data: result,
      });
    },
    // {
    //   now: new Date(),
    //   end_date,
    //   name_filter,
    //   id,
    //   quiz,
    //   submit,
    //   result
    // },
  );
}
export default SemesterController;
