// components/KRS/TeachingEmploymentLetter.jsx
import React, { useState, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { faker } from '@faker-js/faker';

/* ========= PATCH WARNA OKLCH + HAPUS BORDER UNTUK PDF ========= */
const UNSUPPORTED_COLOR_FUNCS = ["oklch(", "oklab(", "lab(", "lch(", "color("];

function patchColorsForHtml2Canvas(clonedDoc) {
  const win = clonedDoc.defaultView;
  if (!win) return;

  clonedDoc.querySelectorAll("*").forEach((node) => {
    const st = win.getComputedStyle(node);
    [
      "color",
      "background-color",
      "border-color",
      "outline-color",
      "text-decoration-color",
      "box-shadow",
    ].forEach((prop) => {
      const val = st.getPropertyValue(prop);
      if (val && UNSUPPORTED_COLOR_FUNCS.some((f) => val.includes(f))) {
        if (prop === "background-color") {
          node.style.setProperty(prop, "#ffffff", "important");
        } else if (prop === "box-shadow") {
          node.style.setProperty(prop, "none", "important");
        } else {
          node.style.setProperty(prop, "#000000", "important");
        }
      }
    });
  });

  clonedDoc.querySelectorAll(".pdf-page").forEach((pageEl) => {
    pageEl.style.border = "none";
    pageEl.style.borderRadius = "0";
    pageEl.style.boxShadow = "none";
  });
}

/* ========================================================= */

const TeachingEmploymentLetter = () => {
  const today = new Date().toISOString().split("T")[0];
  const letterRef = useRef(null);

  // State Bahasa
  const [language, setLanguage] = useState("en");

  // State Gambar
  const [signatureImage, setSignatureImage] = useState("/sign.png");
  const [employeePhoto, setEmployeePhoto] = useState(null); // State untuk Foto Guru/Dosen

  const [form, setForm] = useState({
    type: "school",
    letterDate: today,
    letterPurpose: "Professional Development and Educational Resource Access (Canva for Education)", // Default Purpose

    // Employee Info
    fullName: "Livia Meisari",
    positionTitle: "Guru Mata Pelajaran TIK",
    department: "Departemen Komputer",
    startMonthYear: "February 2023",

    // Institution Info
    instName: "SMA Negeri 1 Jakarta",
    instAddress: "Jln Cikini Raya No. 70, Jakarta Pusat",
    instEmail: "admin@sman1jkt.sch.id",
    instPhone: "+62 21 3190XXXX",

    // Recipient
    recipientName: "Canva for Education Team",
    recipientTitle: "Verification Department",

    // Signatory
    signatoryName: "Drs. H. Acep Syarifudin",
    signatoryTitle: "Kepala Sekolah",
    signatoryNip: "19820312 201001 1 008",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Upload Tanda Tangan
  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignatureImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Upload Foto Guru/Dosen
  const handleEmployeePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEmployeePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const generateFakeData = () => {
    const type = form.type;
    const isSchool = type === 'school';
    const isIndo = language === 'id';

    const instName = isSchool
        ? (isIndo ? `SMA Negeri ${faker.number.int({min: 1, max: 100})} ${faker.location.city()}` : `High School of ${faker.location.city()}`)
        : `${faker.company.name()} University`;

    const instAddress = faker.location.streetAddress(true) + ', ' + faker.location.city();
    const fullName = faker.person.fullName();

    let positionTitle = '';
    if (isSchool) {
        if (isIndo) positionTitle = `Guru Mata Pelajaran ${faker.helpers.arrayElement(['Matematika', 'Fisika', 'TIK', 'Bahasa Inggris', 'Biologi'])}`;
        else positionTitle = `${faker.helpers.arrayElement(['Mathematics', 'Physics', 'ICT', 'English', 'Biology'])} Teacher`;
    } else {
        positionTitle = isIndo ? 'Dosen Tetap' : 'Lecturer / Faculty Member';
    }

    let department = '';
    if (isSchool) {
         department = isIndo
            ? `Bidang Studi ${faker.helpers.arrayElement(['IPA', 'IPS', 'Komputer', 'Bahasa'])}`
            : `${faker.helpers.arrayElement(['Science', 'Social Studies', 'Computer', 'Language'])} Department`;
    } else {
        department = faker.commerce.department();
    }

    const signatoryName = faker.person.fullName();

    let signatoryTitle = '';
    if (isSchool) signatoryTitle = isIndo ? 'Kepala Sekolah' : 'Principal';
    else signatoryTitle = isIndo ? 'Manajer SDM' : 'HR Manager';

    setForm({
      ...form,
      letterDate: today,
      fullName: fullName,
      positionTitle: positionTitle,
      department: department,
      startMonthYear: faker.date.past({ years: 3, refDate: today }).toLocaleDateString(isIndo ? 'id-ID' : 'en-US', { month: 'long', year: 'numeric' }),
      instName: instName,
      instAddress: instAddress,
      instEmail: faker.internet.email({ firstName: 'admin', provider: isSchool ? 'sch.id' : 'edu' }),
      instPhone: faker.phone.number(isSchool ? '(021) #######' : '+1-###-###-####'),
      recipientName: isIndo ? 'Kepada Yth.' : 'To Whom It May Concern',
      recipientTitle: isIndo ? 'Tim Verifikasi' : 'Verification Team',
      signatoryName: signatoryName,
      signatoryTitle: signatoryTitle,
      signatoryNip: faker.number.int({ min: 19700000, max: 19990000 }).toString() + " " + faker.number.int({min: 200000, max: 202000}),
    });
  };

  const formattedIssuedDate = form.letterDate
    ? new Date(form.letterDate).toLocaleDateString(language === 'id' ? "id-ID" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

const handleDownloadPDF = async () => {
  if (!letterRef.current) return;

  try {
    const element = letterRef.current;

    const canvas = await html2canvas(element, {
      scale: 2,                // kualitas masih tajam
      useCORS: true,
      backgroundColor: "#ffffff",
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: (clonedDoc) => {
        patchColorsForHtml2Canvas(clonedDoc);
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.9);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();   // ≈ 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // ≈ 297mm

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // 🔑 PENTING: scale supaya MUAT lebar *dan* tinggi (tidak terpotong)
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const finalWidth = imgWidth * ratio;
    const finalHeight = imgHeight * ratio;

    const marginX = (pdfWidth - finalWidth) / 2;
    const marginY = (pdfHeight - finalHeight) / 2;

    pdf.addImage(imgData, "JPEG", marginX, marginY, finalWidth, finalHeight);
    pdf.save(
      `Employment_Letter_${language.toUpperCase()}_${form.fullName.replace(
        /\s+/g,
        "_"
      )}.pdf`
    );
  } catch (err) {
    console.error("Failed to generate PDF:", err);
    alert("Gagal generate PDF.");
  }
};

const letterStyle = {
  width: "794px",
  minHeight: "1123px",
  padding: "48px", // sebelumnya 64px
  boxSizing: "border-box",
  margin: "0 auto",
};



  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const academicYear = `${currentYear}/${nextYear}`;

  // Dictionary Text
  const t = {
    en: {
        academicStaff: "ACADEMIC STAFF",
        refPrefix: "Ref: HR",
        officialDoc: "Official Document",
        issuedDate: "Issued Date:",
        to: "To:",
        title: "LETTER OF EMPLOYMENT VERIFICATION",
        salutation: form.recipientName && form.recipientName.includes("Whom") ? "To Whom It May Concern," : "Dear Sir/Madam,",
        body1: (<span>This letter serves to officially certify that <strong>{form.fullName}</strong> is a current and active employee of <strong>{form.instName}</strong>.</span>),
        body2: (<span><strong>{form.fullName}</strong> holds the position of <strong>{form.positionTitle}</strong> within the <strong>{form.department}</strong>. They have been employed with our institution since <strong>{form.startMonthYear}</strong> and remain in good standing with the school administration.</span>),
        body3: (<span>We hereby confirm that their primary responsibility includes teaching students in a classroom setting for the current <strong>{academicYear} Academic Year</strong>.</span>),
        // Dynamic Purpose Clause
        body4: (<span>This verification is issued upon the employee's request for <strong>{form.letterPurpose}</strong>.</span>),
        body5: "Should you require any further confirmation regarding this employment, please feel free to contact our administrative office at the details provided above.",
        sincerely: "Sincerely,",
        digitalSignLabel: "Digital Signature",
        signatorySectionTitle: "4. Signatory (Principal/HR)",
        nipLabel: "ID / NIP",
        footer: "Official Administrative Document"
    },
    id: {
        academicStaff: "STAF AKADEMIK",
        refPrefix: "No: SDM",
        officialDoc: "Dokumen Resmi",
        issuedDate: "Tanggal Terbit:",
        to: "Kepada:",
        title: "SURAT KETERANGAN KERJA / MENGAJAR",
        salutation: "Yth. Bapak/Ibu,",
        body1: (<span>Surat ini diterbitkan untuk menerangkan secara resmi bahwa <strong>{form.fullName}</strong> adalah pegawai aktif di <strong>{form.instName}</strong>.</span>),
        body2: (<span><strong>{form.fullName}</strong> menjabat sebagai <strong>{form.positionTitle}</strong> di <strong>{form.department}</strong>. Beliau telah bekerja di institusi kami sejak <strong>{form.startMonthYear}</strong> dan tercatat berkelakuan baik dalam administrasi sekolah.</span>),
        body3: (<span>Kami dengan ini mengonfirmasi bahwa tanggung jawab utama beliau meliputi kegiatan mengajar siswa di kelas untuk <strong>Tahun Ajaran {academicYear}</strong> saat ini.</span>),
        // Dynamic Purpose Clause
        body4: (<span>Surat verifikasi ini diterbitkan atas permintaan pegawai yang bersangkutan untuk keperluan <strong>{form.letterPurpose}</strong>.</span>),
        body5: "Apabila Anda memerlukan konfirmasi lebih lanjut mengenai pekerjaan ini, silakan menghubungi kantor administrasi kami melalui detail kontak yang tertera di atas.",
        sincerely: "Hormat Kami,",
        digitalSignLabel: "Tanda Tangan Digital",
        signatorySectionTitle: "4. Penanda Tangan (Kepala Sekolah)",
        nipLabel: "NIP / NRK",
        footer: "Dokumen Administrasi Resmi"
    }
  };

  const text = language === 'id' ? t.id : t.en;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex justify-center items-start p-4 md:p-8 font-sans">
      <div className="w-full max-w-7xl bg-slate-900/60 border border-slate-800 shadow-2xl rounded-3xl p-6 md:p-8 space-y-8 backdrop-blur">

        {/* Header UI */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-slate-800 text-[11px] text-slate-300 mb-2">
              <span className={`h-1.5 w-1.5 rounded-full ${form.type === 'school' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              {form.type === 'school' ? 'School Format' : 'University Format'}
            </div>
            <h1 className="text-2xl md:text-3xl font-semibold text-white">
              Teaching Employment Letter
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 print:hidden items-center">

            {/* Language Toggle */}
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-700 flex mr-2">
                <button
                    onClick={() => {
                        setLanguage('en');
                        setForm(p => ({
                            ...p,
                            signatoryTitle: 'Principal',
                            letterPurpose: 'Professional Development and Educational Resource Access'
                        }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'en' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    EN
                </button>
                <button
                    onClick={() => {
                        setLanguage('id');
                        setForm(p => ({
                            ...p,
                            signatoryTitle: 'Kepala Sekolah',
                            letterPurpose: 'Pengembangan Profesi dan Akses Sumber Daya Pendidikan'
                        }));
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${language === 'id' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    ID
                </button>
            </div>

            <button
              onClick={generateFakeData}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20 transition-colors"
            >
              Generate Data
            </button>

            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-100 text-slate-900 hover:bg-white transition-colors"
            >
              Download PDF
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-[400px_minmax(0,1fr)] gap-8">

          {/* === FORM SECTION === */}
          <section className="space-y-6 print:hidden h-fit lg:sticky lg:top-8 overflow-y-auto max-h-[80vh] custom-scrollbar pr-2">

            {/* 1. Context / Purpose (NEW) */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
                <h2 className="font-semibold text-amber-400 text-xs uppercase tracking-wide border-b border-slate-800 pb-2">
                    Start Here: Letter Purpose
                </h2>
                <div>
                    <label className="text-xs text-slate-400 block mb-1">Purpose of Verification (General)</label>
                    <textarea
                        name="letterPurpose"
                        value={form.letterPurpose}
                        onChange={handleChange}
                        rows={2}
                        className="w-full bg-slate-950/50 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-amber-50 focus:border-amber-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                        *This text will appear in the closing paragraph. E.g., "Visa Application", "Canva Verification".
                    </p>
                </div>
            </div>

            {/* 2. Institution Info */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
              <h2 className="font-semibold text-slate-100 text-xs uppercase tracking-wide border-b border-slate-800 pb-2">
                2. Institution Details
              </h2>
              <div className="space-y-3">
                 <div>
                    <label className="text-xs text-slate-400 block mb-1">Name</label>
                    <input name="instName" value={form.instName} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                 </div>
                 <div>
                    <label className="text-xs text-slate-400 block mb-1">Address</label>
                    <textarea name="instAddress" value={form.instAddress} onChange={handleChange} rows={2} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                 </div>

                 {form.type === 'school' && (
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Email</label>
                            <input name="instEmail" value={form.instEmail} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 block mb-1">Phone</label>
                            <input name="instPhone" value={form.instPhone} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                        </div>
                    </div>
                 )}
              </div>
            </div>

            {/* 3. Employee Info & Photo */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
              <h2 className="font-semibold text-slate-100 text-xs uppercase tracking-wide border-b border-slate-800 pb-2">
                3. Employee Info & Photo
              </h2>
              <div className="space-y-3">
                 {/* Upload Photo Input */}
                 <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-700 border-dashed">
                    <label className="text-xs text-slate-300 block mb-2 font-medium">Upload Employee Photo (Pas Foto)</label>
                    <input type="file" accept="image/*" onChange={handleEmployeePhotoUpload} className="w-full text-xs text-slate-400 file:bg-indigo-600 file:text-white file:border-0 file:py-1.5 file:px-3 file:rounded-md hover:file:bg-indigo-500 cursor-pointer" />
                 </div>

                 <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                 <input name="positionTitle" value={form.positionTitle} onChange={handleChange} placeholder="Position" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                 <input name="department" value={form.department} onChange={handleChange} placeholder="Department" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                 <input name="startMonthYear" value={form.startMonthYear} onChange={handleChange} placeholder="Start Date" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
            </div>

            {/* 4. Recipient */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
               <h2 className="font-semibold text-slate-100 text-xs uppercase tracking-wide border-b border-slate-800 pb-2">
                 4. Recipient
               </h2>
               <div className="space-y-3">
                  <input name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="Recipient Name" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                  <input name="recipientTitle" value={form.recipientTitle} onChange={handleChange} placeholder="Recipient Title" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
               </div>
            </div>

            {/* 5. Signatory */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
               <h2 className="font-semibold text-slate-100 text-xs uppercase tracking-wide border-b border-slate-800 pb-2">
                {text.signatorySectionTitle}
              </h2>
              <div className="space-y-3">
                 {/* Upload File */}
                 <div>
                    <label className="text-xs text-slate-400 block mb-1">Upload Signature/Stamp (PNG/JPG)</label>
                    <input type="file" accept="image/*" onChange={handleSignatureUpload} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg text-sm text-slate-300 file:bg-slate-800 file:text-white file:border-0 file:py-2 file:px-3 file:mr-3 hover:file:bg-slate-700" />
                 </div>

                 <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Name</label>
                        <input name="signatoryName" value={form.signatoryName} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-1">Title</label>
                        <input name="signatoryTitle" value={form.signatoryTitle} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                    </div>
                 </div>

                 <div>
                    <label className="text-xs text-slate-400 block mb-1">{text.nipLabel}</label>
                    <input name="signatoryNip" value={form.signatoryNip} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
                 </div>
              </div>
            </div>
          </section>

          {/* === LETTER PREVIEW === */}
          <div className="flex justify-center bg-slate-800/50 rounded-[3rem] p-8 overflow-hidden">
             <section
                ref={letterRef}
                style={letterStyle}
                className="bg-white text-slate-900 shadow-2xl relative pdf-page flex flex-col"
             >
                {/* ================= HEADER LOGIC ================= */}
                {form.type === 'university' ? (
                    /* --- UNIVERSITY HEADER --- */
                    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6 mb-8">
                        <div className="flex items-center gap-5">
                            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-serif font-bold text-slate-400">
                                U
                            </div>
                            <div>
                                <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">{form.instName}</h2>
                                <p className="text-sm text-slate-600 w-[300px] leading-snug mt-1">{form.instAddress}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{text.academicStaff}</p>
                            <p className="text-sm text-slate-500">{text.refPrefix}/{new Date().getFullYear()}/001</p>
                        </div>
                    </div>
                ) : (
                    /* --- SCHOOL HEADER (Professional) --- */
                    <div className="border-b-4 border-slate-800 pb-6 mb-8 flex justify-between items-end">
                        <div className="text-left">
                             <h2 className="text-2xl font-black uppercase text-slate-900 tracking-wider mb-2">
                                {form.instName}
                             </h2>
                             <div className="text-xs text-slate-600 font-medium space-y-1">
                                <p>{form.instAddress}</p>
                                <p className="flex items-center gap-3 mt-1">
                                   <span>✉️ {form.instEmail}</span>
                                   <span>☎️ {form.instPhone}</span>
                                </p>
                             </div>
                        </div>
                        <div className="text-right">
                            <div className="bg-slate-900 text-white px-4 py-1 text-xs font-bold uppercase tracking-widest inline-block mb-2">
                                {text.officialDoc}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= BODY CONTENT ================= */}
                <div className="flex-1 px-8 relative">

                    {/* TOP SECTION: Date, Recipient (Left) & Photo (Right) */}
                    <div className="flex justify-between items-start mb-8">
                        {/* LEFT COLUMN: Date & To */}
                        <div className="flex-1 pr-4">
                            <div className="mb-6">
                                <p className="text-slate-500 text-sm mb-1">{text.issuedDate}</p>
                                <p className="font-semibold text-slate-800">{formattedIssuedDate}</p>
                            </div>

                            {form.recipientName && (
                                <div className="max-w-[300px]">
                                    <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{text.to}</p>
                                    <p className="font-bold text-slate-900">{form.recipientName}</p>
                                    <p className="text-sm text-slate-600">{form.recipientTitle}</p>
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Employee Photo (If Uploaded) */}
                        {employeePhoto ? (
                            <div className="w-32 h-40 bg-slate-100 border border-slate-200 shadow-sm flex-shrink-0 relative overflow-hidden">
                                <img src={employeePhoto} alt="Employee" className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            // Placeholder if needed, or empty
                             <div className="w-32 h-40 border border-slate-200 border-dashed flex items-center justify-center text-xs text-slate-300">
                                [Pas Foto 3x4]
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <div className="mb-8 text-center">
                        <h1 className="text-xl font-bold uppercase underline decoration-2 underline-offset-4 text-slate-900">
                            {text.title}
                        </h1>
                    </div>

                    {/* Salutation */}
                    <p className="mb-6 font-medium text-slate-800">
                        {text.salutation}
                    </p>

                    {/* Letter Body (DYNAMIC LANGUAGE & PURPOSE) */}
                    <div className="space-y-4 text-[15px] leading-relaxed text-slate-800 text-justify">
                        <p>{text.body1}</p>
                        <p>{text.body2}</p>
                        <p className="bg-slate-50 p-4 border-l-4 border-slate-300 italic text-slate-700">
                            {text.body3}
                        </p>

                        {/* Dynamic Purpose Clause */}
                        <p>{text.body4}</p>

                        <p>{text.body5}</p>
                    </div>

                    {/* Closing */}
                    <div className="mt-12">
                        <p className="mb-4 text-slate-800 font-medium">{text.sincerely}</p>

                        {/* SIGNATURE BLOCK */}
                        <div className="relative inline-block min-w-[250px]">
                            {/* Area Gambar Tanda Tangan */}
                            <div className="relative h-28 w-full">
                                {signatureImage ? (
                                    <img
                                        src={signatureImage}
                                        alt="Signature"
                                        className="h-full w-auto max-w-[200px] object-contain object-bottom absolute bottom-[-10px] left-0 z-10 mix-blend-multiply"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-end text-slate-300 italic text-sm pb-2">
                                        [Signature Image]
                                    </div>
                                )}

                                <div className="absolute top-2 right-0 border border-slate-200 bg-white/50 text-[9px] text-slate-400 px-1 py-0.5 rounded">
                                    {text.digitalSignLabel}
                                </div>
                            </div>

                            <div className="border-t-2 border-slate-800 mb-2 w-full"></div>

                            <div>
                                <p className="font-bold text-slate-900 uppercase tracking-wide text-lg leading-tight">
                                    {form.signatoryName}
                                </p>
                                <p className="text-slate-700 font-medium mt-1">
                                    {form.signatoryTitle}
                                </p>
                                <p className="text-sm text-slate-500 mt-0.5">
                                    {text.nipLabel}: {form.signatoryNip}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-8 pb-4 border-t border-slate-200 text-center">
                     <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                        {form.instName} • {text.footer} • {new Date().getFullYear()}
                     </p>
                </div>

             </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeachingEmploymentLetter;