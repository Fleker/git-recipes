import { getLocaleTimeFormat, NgLocalization } from '@angular/common';
import {
    GanttView,
    GanttViewOptions,
    primaryDatePointTop,
    secondaryDatePointTop,
    GanttViewDate,
    GanttDate,
    eachDayOfInterval,
    GanttDatePoint,
    GanttViewType,
    GanttItem
} from '@worktile/gantt';

const viewOptions: GanttViewOptions = {
    cellWidth: 200,
    start: new GanttDate(),
    end: new GanttDate(),
};

export class GanttViewCustom extends GanttView {
    override showWeekBackdrop = true;

    override showTimeline = true;

    override viewType = GanttViewType.day;

    constructor(start: GanttViewDate, end: GanttViewDate, private items: GanttItem[], options?: GanttViewOptions) {
      super(start, end, Object.assign({}, viewOptions, options));
      console.log(`Go seconds ${start.date.value} to ${end.date.value}`)
      this.options.end = end.date
    }

    startOf(date: GanttDate) {
        return date.startOfWeek({ weekStartsOn: 1 });
    }

    endOf(date: GanttDate) {
        return date.endOfWeek({ weekStartsOn: 1 });
    }

    getPrimaryWidth() {
      return this.getCellWidth() * 7;
    }

    getDayOccupancyWidth(date: GanttDate): number {
        return this.cellWidth;
    }

    getPrimaryDatePoints(): GanttDatePoint[] {
      // if (!this.items) return []

      const items = (() => {
        const p = []
        let date = this.start.addMinutes(-60)
        console.log('start', date.value.toString())
        const end = this.end.addMinutes(60)
        console.log('end', end.value.toString())
        while (date.value < end.value) {
          p.push(date.value)
          date = date.clone()
          date = date.addMinutes(5)
          // console.log(date.value.toString(), this.end.value.toString())
        }
        return p
      })()
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < items.length; i++) {
            const start = new GanttDate(items[i]);
            const isWeekend = start.isWeekend();
            const point = new GanttDatePoint(
                start,
                `${start.format('MM/d ~ HH:MM')}`,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                primaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            if (isWeekend) {
                point.style = { fill: '#ff9f73' };
            }
            if (start.isToday()) {
                point.style = { fill: '#ff9f73' };
            }
            points.push(point);
        }
        return points;
    }

    getSecondaryDatePoints(): GanttDatePoint[] {
      // if (!this.items) return []
      const items = (() => {
        const p = []
        let date = this.start.addMinutes(-60)
        const end = this.end.addMinutes(60)
        while (date.value < end.value) {
          p.push(date.value)
          date = date.clone()
          date = date.addMinutes(5)
          // console.log(date.value.toString(), this.end.value.toString())
        }
        return p
      })()
        const points: GanttDatePoint[] = [];
        for (let i = 0; i < items.length; i++) {
            const start = new GanttDate(items[i]);
            const isWeekend = start.isWeekend();
            const point = new GanttDatePoint(
                start,
                ``,
                i * this.getCellWidth() + this.getCellWidth() / 2,
                secondaryDatePointTop,
                {
                    isWeekend,
                    isToday: start.isToday()
                }
            );
            if (isWeekend) {
                point.style = { fill: '#ff9f73' };
            }
            if (start.isToday()) {
                point.style = { fill: '#ff9f73' };
            }
            points.push(point);
        }
        return points;
    }
}