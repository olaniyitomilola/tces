function getWeekForDate(weeks, date = new Date()) {
    // Remove time part for all comparisons
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  
    return weeks.find(week => {
      const start = new Date(week.start.getFullYear(), week.start.getMonth(), week.start.getDate());
      const end = new Date(week.end.getFullYear(), week.end.getMonth(), week.end.getDate());
      return targetDate >= start && targetDate <= end;
    });
  }

  
  export default getWeekForDate;