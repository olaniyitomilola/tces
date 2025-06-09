const getRailWeeks = (year) => {
    const weeks = [];
    const start = new Date(year, 3, 1); // April 1
    let count = 1;
  
    const week1End = new Date(start);
    while (week1End.getDay() !== 5) week1End.setDate(week1End.getDate() + 1); // Friday
  
    weeks.push({
      number: count,
      start: new Date(start),
      end: new Date(week1End)
    });
    count++;
  
    let nextStart = new Date(week1End);
    nextStart.setDate(nextStart.getDate() + 1); // Saturday
  
    while (nextStart.getFullYear() === year || (nextStart.getFullYear() === year + 1 && count <= 52)) {
      const end = new Date(nextStart);
      end.setDate(end.getDate() + 6);
      weeks.push({
        number: count,
        start: new Date(nextStart),
        end: new Date(end)
      });
      nextStart.setDate(nextStart.getDate() + 7);
      count++;
    }
  
    return weeks;
  };


  export default getRailWeeks;