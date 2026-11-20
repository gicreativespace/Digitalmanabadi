export function currentAcademicYearCode(date = new Date()) {
  const year = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", year: "2-digit" }).format(date);
  return year;
}

export function classNumberFromId(classId) {
  const match = /^class-([1-5])$/i.exec(String(classId || ""));
  if (!match) throw Object.assign(new Error("Choose a valid class."), { status: 400 });
  return Number(match[1]);
}

export function validateDob(value) {
  const dob = String(value || "").replace(/[^0-9]/g, "");
  if (!/^\\d{8}$/.test(dob)) throw Object.assign(new Error("Enter DOB in DDMMYYYY format."), { status: 400 });
  const day = Number(dob.slice(0, 2)), month = Number(dob.slice(2, 4)), year = Number(dob.slice(4));
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (year < 1900 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date > today) {
    throw Object.assign(new Error("Enter a valid date of birth."), { status: 400 });
  }
  return dob;
}
