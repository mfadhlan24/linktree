// components/KRS/SlipKRS.jsx
export default function SlipKRS({
  C,
  L,
  uniName,
  semesterText,
  student,
  courses,
  totalCredits,
  generatedAt,
  studentSignatureBase64,
  isLast = false,
}) {
  return (
    <div
      className="pdf-page w-[210mm] min-h-[297mm] p-[14mm] bg-white text-black box-border shadow-2xl"
      style={{
        pageBreakAfter: isLast ? "auto" : "always",
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      {/* HEADER */}
      <div className="flex items-center border-b-2 border-black pb-2 mb-4 min-h-[80px]">
        {C.logoUrl && (
          <div className="mr-4 flex-shrink-0">
            <img
              src={C.logoUrl}
              alt="Logo"
              className={`${C.logoClass} object-contain`}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          </div>
        )}
        <div className="flex-1 text-center">
          <h1 className="font-extrabold uppercase tracking-wide text-[17pt] leading-tight">
            {uniName}
          </h1>
          <p className="text-[10pt]">{C.uniAddress}</p>
          <p className="text-[10pt] italic">{C.uniContact}</p>
        </div>
      </div>

      <div className="text-center mb-5">
        <h2 className="font-black underline uppercase text-[14pt] tracking-[0.08em]">
          {C.docTitle}
        </h2>
        <p className="uppercase mt-1 text-[11pt] font-bold tracking-[0.06em]">
          {semesterText}
        </p>
      </div>

      {/* INFO MAHASISWA */}
      <table className="w-full mb-4 text-[10pt]">
        <tbody>
          <tr>
            <td className="font-bold w-32 py-0.5">{L.studentName}</td>
            <td className="w-2">:</td>
            <td className="uppercase">{student.name}</td>
            <td className="font-bold w-28 pl-4">{L.faculty}</td>
            <td className="w-2">:</td>
            <td>{student.faculty}</td>
          </tr>
          <tr>
            <td className="font-bold py-0.5">{L.id}</td>
            <td>:</td>
            <td>{student.id}</td>
            <td className="font-bold pl-4">{L.dept}</td>
            <td>:</td>
            <td>{student.department}</td>
          </tr>
          <tr>
            <td className="font-bold py-0.5">{L.level}</td>
            <td>:</td>
            <td>{student.level}</td>
            <td className="font-bold pl-4">{L.section}</td>
            <td>:</td>
            <td>{student.section}</td>
          </tr>
          <tr>
            <td className="font-bold py-0.5">Email</td>
            <td>:</td>
            <td>{student.email}</td>
            <td className="font-bold pl-4">Phone</td>
            <td>:</td>
            <td>{student.phone}</td>
          </tr>
        </tbody>
      </table>

      {/* TABEL KULIAH */}
      <table className="w-full border-collapse border border-black mb-4 text-[10pt]">
        <thead>
          <tr className="bg-slate-100">
            <th className="border border-black p-1 w-8 text-center align-middle">No</th>
            <th className="border border-black p-1 w-20 text-center align-middle">
              {C.lang === "en" ? "Code" : "Kode"}
            </th>
            <th className="border border-black p-1 text-center align-middle">
              {C.lang === "en" ? "Course" : "Mata Kuliah / Course"}
            </th>
            <th className="border border-black p-1 w-12 text-center align-middle">
              {C.labels.credits}
            </th>
            <th className="border border-black p-1 w-24 text-center align-middle">
              {C.lang === "en" ? "Schedule" : "Jadwal"}
            </th>
            <th className="border border-black p-1 w-20 text-center align-middle">
              {C.lang === "en" ? "Venue" : "Ruang"}
            </th>
            <th className="border border-black p-1 w-32 text-center align-middle">
              {C.lang === "en" ? "Lecturer" : "Dosen"}
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c, idx) => (
            <tr key={idx}>
              <td className="border border-black p-1 text-center align-middle">{c.no}</td>
              <td className="border border-black p-1 text-center align-middle">{c.code}</td>
              <td className="border border-black p-1 font-bold text-center align-middle">
                {c.name}
              </td>
              <td className="border border-black p-1 text-center align-middle">
                {c.credits > 0 ? c.credits : ""}
              </td>
              <td className="border border-black p-1 text-center align-middle">
                <div className="text-[9pt]">{c.day}</div>
                <div className="text-[8pt]">{c.time}</div>
              </td>
              <td className="border border-black p-1 text-center align-middle text-[9pt]">
                {c.venue}
              </td>
              <td className="border border-black p-1 text-center align-middle italic text-[9pt]">
                {c.lecturer}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-slate-100 font-bold">
            <td
              colSpan={3}
              className="border border-black p-1 uppercase text-right"
            >
              Total {C.labels.credits}
            </td>
            <td className="border border-black p-1 text-center align-middle">
              {totalCredits}
            </td>
            <td colSpan={3} className="border border-black p-1 bg-slate-300" />
          </tr>
        </tfoot>
      </table>

      {/* FOOTER & TTD */}
      <div className="grid grid-cols-3 gap-4 text-center mt-8 text-[10pt]">
        <div>
          <p className="mb-4">{C.labels.studentName}</p>
          <div className="h-20 flex items-center justify-center mb-2 overflow-hidden">
            {studentSignatureBase64 ? (
              <img
                src={studentSignatureBase64}
                alt="Student Signature"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="h-16 w-40 border-b border-dashed border-gray-400" />
            )}
          </div>
          <p className="font-bold underline uppercase">{student.name}</p>
        </div>
        <div>
          <p className="mb-16">{C.labels.consultant}</p>
          <p className="border-b border-black w-3/4 mx-auto" />
        </div>
        <div>
          <p className="mb-4">{C.officeText}</p>
          <div className="h-20 flex items-center justify-center mb-2">
            {C.signUrl ? (
              <img
                src={C.signUrl}
                alt="Digital Signature"
                className="h-full object-contain"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            ) : (
              <div className="h-16 w-full border-b border-dashed border-gray-400" />
            )}
          </div>
          <p className="mb-2 text-[9pt] text-gray-600">Printed: {generatedAt}</p>
          {Array.isArray(C.rectorNames) && C.rectorNames.length > 0 && (
            <p className="mt-1 text-[9pt] font-bold">{C.rectorNames[0]}</p>
          )}
        </div>
      </div>

      <div className="mt-4 text-center border-t pt-2 text-[9pt] text-gray-500">
        <p className="italic text-red-600 uppercase tracking-widest mt-1">
          {C.confidential || "*** THIS DOCUMENT IS STRICTLY CONFIDENTIAL ***"}
        </p>
      </div>
    </div>
  );
}