/**
 * Created by shimizu.kenji on 2017/05/13.
 */
new Vue({
    el: '#calendar',
    data: {
        selectedYear: {
            min: 2000,
            max: 2020
        },
        years: [],
        months: [],
        dayOfWeeks:[
            {
                index: 0,
                name: 'Sun'
            },
            {
                index: 1,
                name: 'Mon'
            },
            {
                index: 2,
                name: 'Tue'
            },
            {
                index: 3,
                name: 'Wed'
            },
            {
                index: 4,
                name: 'Thu'
            },
            {
                index: 5,
                name: 'Fri'
            },
            {
                index: 6,
                name: 'Sat'
            }
        ],
        tasks: {
            "2017-05-15": [
                {
                    finished: false,
                    title: "[Sample]レポートを提出する"
                },
                {
                    finished: true,
                    title: "[Sample]〇×さんにメールする"
                }
            ]
        },
        calendar: {},
        newTask: {},
        selectTask: {}
    },
    created: function() {
        this.thisMonth();
        this.years = this.createYears();
        this.months = this.createMonths();
    },
    methods: {
        nextMonth: function(event) {
            this.updateCalendar(moment([this.calendar.year, this.calendar.month, 1]).add(1, 'months'));
        },
        prevMonth: function(event) {
            this.updateCalendar(moment([this.calendar.year, this.calendar.month, 1]).subtract(1, 'months'));
        },
        thisMonth: function(event) {
            this.updateCalendar(moment().date(1));
        },
        selectMonth: function(event) {
            if (this.calendar.year && this.calendar.month) {
                this.updateCalendar(moment([this.calendar.year, this.calendar.month, 1]));
            }
        },
        updateCalendar: function(date) {
            var year = date.year();
            if (this.selectedYear.min > year || year > this.selectedYear.max) {
                return;
            }
            this.calendar.year = year;
            this.calendar.month = date.month();
            var nextMonth = date.clone().add(1, 'months').month();
            while(date.day() != this.dayOfWeeks[0].index) {
                date.subtract(1, 'days');
            }

            var weeks = [];
            while(date.month() != nextMonth) {
                var days = []
                for (var i = 0; i < this.dayOfWeeks.length; i++) {
                    var dateKey = date.format("YYYY-MM-DD");
                    var tasks = this.tasks[dateKey];
                    if (!tasks) {
                        tasks = [];
                        this.$set(this.tasks, dateKey, tasks);
                    }
                    days.push({
                        "date": date.clone(),
                        "dayOfWeek": this.dayOfWeeks[i],
                        "tasks": tasks
                    });
                    date.add(1, 'days');
                }
                weeks.push({
                    'days': days
                });
            }
            Vue.set(this.calendar, 'weeks', weeks);
        },
        isStandardHoliday: function(dayOfWeek) {
            return dayOfWeek.index == 6;
        },
        isLegalHoliday: function(dayOfWeek) {
            return dayOfWeek.index == 0;
        },
        createYears: function() {
            var years = [];
            for (var year = this.selectedYear.min; year <= this.selectedYear.max; year++) {
                years.push(year);
            }
            return years;
        },
        createMonths: function() {
            var months = [];
            for (var month = 1; month <= 12; month++) {
                months.push(month);
            }
            return months;
        },
        showNewTask: function(date) {
            var task = {
                year: date.year(),
                month: date.month(),
                day: date.date()
            };
            Vue.set(this, 'newTask', task);
            $('#new-task-modal').modal()
        },
        createTask: function(event) {
            if (this.newTask.title) {
                var task = {
                    finished: false,
                    title: this.newTask.title,
                    year: this.newTask.year,
                    month: this.newTask.month,
                    day: this.newTask.day
                };
                var date = moment([this.newTask.year, this.newTask.month, this.newTask.day]).format('YYYY-MM-DD');
                var tasks = this.tasks[date];
                if (tasks) {
                    tasks.push(task);
                }
            }
            $('#new-task-modal').modal('hide');
        },
        showTask: function(task) {
            Vue.set(this, 'selectTask', task);
            $('#task-modal').modal()
        },
        completedTask: function(task) {
            this.selectTask.finished = true;
            $('#task-modal').modal('hide');
        }
    }
});
$(function () {
    $(document).tooltip({
        selector: '[data-toggle="tooltip"]'
    });
});
