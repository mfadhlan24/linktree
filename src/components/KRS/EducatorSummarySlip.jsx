// components/EducatorSummarySlip.jsx
export default function EducatorSummarySlip({
  org,
  educatorId,
  fullName,
  birthYear,
  status = "Issued",
  effectiveDate = "08/15/2024",
  issueDate = "08/10/2024",
  expirationDate = "08/14/2029",
  teachingField = { name: "Integrated Mathematics", code: "050230" },
  submittedDate = "08/01/2024",
  eSignStatus = "Completed",
  isLast = false,
}) {
  return (
    <div
      className="pdf-page w-[210mm] min-h-[297mm] p-[16mm] bg-white text-black box-border shadow-2xl"
      style={{
        pageBreakAfter: isLast ? "auto" : "always",
        fontFamily: '"Times New Roman", Times, serif',
      }}
    >
      <div className="flex flex-col items-center mb-6 text-center group">
        {org.logoUrl && (
          <div className="w-full flex justify-center mb-4">
            <div
              className="resize-y overflow-hidden flex justify-center items-center border border-transparent hover:border-dashed hover:border-slate-300 transition-all rounded p-1 relative"
              style={{ height: "140px", minHeight: "50px", width: "100%" }}
              title="Drag bottom-right corner to resize logo"
            >
              <img
                src={org.logoUrl}
                alt="Org Logo"
                className="w-full h-full object-contain pointer-events-none"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-slate-400 opacity-0 group-hover:opacity-100 pointer-events-none" />
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="font-bold text-[24px] tracking-wide uppercase leading-tight">
            {org.name}
          </div>
          <div className="font-semibold text-[14px] text-slate-500 mt-2">
            ID: {educatorId}
          </div>
        </div>
      </div>

      <div className="mt-8 text-[20px] font-bold">
        Educator Summary for {fullName}
      </div>
      <div className="text-slate-500 mb-3 text-sm">
        State Educator Licensing Portal
      </div>

      <div className="border-b border-slate-200 py-2 font-semibold text-sm">
        Demographics
      </div>
      <div className="flex justify-between items-center border-b border-slate-200 py-3 text-sm">
        <span className="text-slate-500">Birth Year:</span>
        <span>{birthYear}</span>
      </div>

      <div className="border-b border-slate-200 py-2 mt-1 font-semibold text-sm">
        Credentials
      </div>
      <div className="grid grid-cols-4 gap-3 border-b border-slate-200 py-3 text-[13px]">
        <div className="font-semibold text-slate-500">STATUS</div>
        <div className="font-semibold text-slate-500">EFFECTIVE DATE</div>
        <div className="font-semibold text-slate-500">ISSUE DATE</div>
        <div className="font-semibold text-slate-500">EXPIRATION DATE</div>

        <div className="mt-1">
          <span className="inline-flex px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[12px] font-bold">
            {status}
          </span>
        </div>
        <div className="mt-1">{effectiveDate}</div>
        <div className="mt-1">{issueDate}</div>
        <div className="mt-1">{expirationDate}</div>
      </div>

      <div className="border-b border-slate-200 py-2 mt-2 font-bold text-sm tracking-wide">
        CREDENTIAL
      </div>
      <div className="pt-2 text-sm leading-relaxed">
        <p>5 Year Professional Adolescence to Young Adult (7–12) License</p>

        <div className="mt-3">
          <div className="font-semibold text-slate-500">Credential Number:</div>
          <div className="mt-1">
            Teaching Fields: {teachingField.name} [{teachingField.code}]
          </div>
        </div>

        <div className="flex justify-end mt-4 text-[12px]">
          <div className="text-right text-slate-500">
            <div className="font-bold text-slate-600">{teachingField.code}</div>
            <div>Issue Date</div>
            <div className="text-slate-900">{issueDate}</div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 py-2 mt-4 font-semibold text-sm">
        Submitted Applications
      </div>
      <div className="grid grid-cols-[1fr_3fr_1fr] gap-3 py-3 text-[13px]">
        <div className="font-semibold text-slate-500">SUBMITTED DATE</div>
        <div className="font-semibold text-slate-500">CREDENTIAL / STATUS</div>
        <div className="font-semibold text-slate-500">E-SIGN STATUS</div>

        <div className="mt-1">{submittedDate}</div>
        <div className="mt-1">
          5 Year Professional Adolescence to Young Adult (7–12) License ·{" "}
          <span className="font-bold">{status}</span>
        </div>
        <div className="mt-1">{eSignStatus}</div>
      </div>
    </div>
  );
}