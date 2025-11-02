// ฟังก์ชัน checkSolution - ตรวจสอบว่ายังสามารถหาคำตอบได้หรือไม่
export const checkSolution = (boardValue, target) => {
  // ตรวจสอบว่ามีข้อมูล boardValue หรือไม่
  if (!boardValue || !Array.isArray(boardValue)) {
    return false;
  }

  // ดึงตัวเลขทั้งหมดจาก boardValue (filter ค่าที่ไม่ใช่ 0 และไม่ใช่ undefined/null)
  const nums = boardValue
    .flat()
    .filter(value => value !== 0 && value !== null && value !== undefined && !isNaN(value));

  // ถ้าไม่มีตัวเลขเลย หรือมีน้อยกว่า 1 ตัว
  if (!nums || nums.length === 0) {
    return false;
  }

  // ถ้ามีตัวเลขแค่ตัวเดียว ให้ตรวจสอบว่าตรงกับ target หรือไม่
  if (nums.length === 1) {
    return Math.abs(nums[0] - target) < 0.001;
  }

  // ฟังก์ชัน recursive เพื่อหาวิธีการคำนวณ
  const solve = (arr) => {
    if (arr.length === 1) {
      return Math.abs(arr[0] - target) < 0.001;
    }

    // ลองจับคู่ตัวเลขทุกคู่
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        const a = arr[i];
        const b = arr[j];
        const remaining = arr.filter((_, index) => index !== i && index !== j);
        
        // สร้างรายการ operations ที่เป็นไปได้
        const operations = [a + b, a - b, b - a, a * b];
        if (Math.abs(b) > 0.001) operations.push(a / b);
        if (Math.abs(a) > 0.001) operations.push(b / a);

        // ลองคำนวณทุก operation
        for (const op of operations) {
          // ตรวจสอบว่าเป็นตัวเลขที่ valid
          if (isNaN(op) || !isFinite(op)) continue;
          
          if (solve([op, ...remaining])) {
            return true;
          }
        }
      }
    }
    return false;
  };

  return solve(nums);
};



