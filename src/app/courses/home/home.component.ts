import { Component, OnInit } from "@angular/core";
import { compareCourses, Course } from "../model/course";
import { Observable } from "rxjs";
import { defaultDialogConfig } from "../shared/default-dialog-config";
import { EditCourseDialogComponent } from "../edit-course-dialog/edit-course-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { map, shareReplay, switchMap, tap } from "rxjs/operators";
import { CoursesHttpService } from "../services/courses-http.service";
import { Store } from "@ngrx/store";
import { AppState, getUser } from "../../auth/reducers";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  coursesTotal$: Observable<number>;
  coursesInCategory: number;
  coursesInCategory1: number;
  coursesInCategory2: number;
  adminMode$: Observable<boolean>;

  loading$: Observable<boolean>;

  angularCourses$: Observable<Course[]>;

  otherCourses$: Observable<Course[]>;

  constructor(
    private dialog: MatDialog,
    private coursesHttpService: CoursesHttpService,
    private store: Store<AppState>
  ) {}

  ngOnInit() {
    this.adminMode$ = this.store
      .select(getUser)
      .pipe(switchMap(async (user) => user?.role === "admin"));
    this.reload();
  }

  reload() {
    const courses$ = this.coursesHttpService.findAllCourses().pipe(
      map((courses) => courses.sort(compareCourses)),
      shareReplay()
    );

    this.loading$ = courses$.pipe(map((courses) => !!courses));

    this.angularCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => {
          this.coursesInCategory = this.coursesInCategory1 = courses.filter(
            (course) => course.instructor == "Angular University"
          ).length;
          return course.instructor == "Angular University";
        })
      )
    );

    this.otherCourses$ = courses$.pipe(
      map((courses) =>
        courses.filter((course) => {
          this.coursesInCategory2 = courses.filter(
            (course) => course.instructor != "Angular University"
          ).length;
          return course.instructor != "Angular University";
        })
      )
    );

    this.coursesTotal$ = courses$.pipe(map((courses) => courses.length));
  }

  onAddCourse() {
    const dialogConfig = defaultDialogConfig();

    dialogConfig.data = {
      dialogTitle: "Create Course",
      mode: "create",
    };

    this.dialog.open(EditCourseDialogComponent, dialogConfig);
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    if (tabChangeEvent.index === 0) {
      this.coursesInCategory = this.coursesInCategory1;
    }
    if (tabChangeEvent.index === 1) {
      this.coursesInCategory = this.coursesInCategory2;
    }
  };
}
