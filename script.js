/* =========================================================
   script.js — INTERAKSI WEBSITE
   File ini tidak perlu diubah untuk mengganti teks atau foto.
   ========================================================= */


// ---------- 1. PINDAH HALAMAN (Beranda, Profil, Penutup) ----------
const semuaHalaman = document.querySelectorAll(".page");
const semuaMenu = document.querySelectorAll(".nav__link");
const daftarHalaman = Array.from(semuaHalaman, (h) => h.id);
const halamanAwal = "beranda";
const judulAsli = document.title;

function tampilkanHalaman() {
  const diminta = location.hash.slice(1);
  const tujuan = daftarHalaman.includes(diminta) ? diminta : halamanAwal;
  const halaman = document.getElementById(tujuan);

  semuaHalaman.forEach((h) => h.classList.toggle("is-active", h === halaman));

  semuaMenu.forEach((link) => {
    if (link.getAttribute("href") === "#" + tujuan) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });

  document.title = tujuan === halamanAwal ? judulAsli : halaman.dataset.title + " · " + judulAsli;
  window.scrollTo({ top: 0, behavior: "instant" });
  siapkanAnimasi(halaman);
}

window.addEventListener("hashchange", tampilkanHalaman);


// ---------- 2. ANIMASI MUNCUL SAAT DIGULIR ----------
// Hanya bagian yang belum terlihat di layar yang disembunyikan dulu,
// lalu muncul perlahan saat pengunjung menggulir ke bawah.
const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)");

const pengamat = "IntersectionObserver" in window
  ? new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-hidden");
          pengamat.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 })
  : null;

function siapkanAnimasi(halaman) {
  if (!pengamat || kurangiGerak.matches) return;

  halaman.querySelectorAll(".reveal:not(.is-ready)").forEach((el) => {
    el.classList.add("is-ready");
    if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
      el.classList.add("is-hidden");
      pengamat.observe(el);
    }
  });
}


// ---------- 3. MODE TERANG / GELAP ----------
const tombolTema = document.getElementById("themeBtn");
const perangkatGelap = window.matchMedia("(prefers-color-scheme: dark)");

function temaSekarang() {
  return document.documentElement.getAttribute("data-theme") || (perangkatGelap.matches ? "dark" : "light");
}

function perbaruiTombolTema() {
  const gelap = temaSekarang() === "dark";
  const label = gelap ? "Ganti ke mode terang" : "Ganti ke mode gelap";
  tombolTema.dataset.mode = gelap ? "dark" : "light";
  tombolTema.setAttribute("aria-label", label);
  tombolTema.title = label;
}

tombolTema.addEventListener("click", () => {
  const temaBaru = temaSekarang() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", temaBaru);
  try { localStorage.setItem("tema", temaBaru); } catch (e) {}
  perbaruiTombolTema();
});

perangkatGelap.addEventListener("change", perbaruiTombolTema);
new MutationObserver(perbaruiTombolTema).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});


// ---------- 4. FOTO ----------
// Jika file foto belum ada di folder "foto", tampilkan kotak "Ganti foto di sini".
document.querySelectorAll(".foto img").forEach((img) => {
  const sembunyikan = () => img.remove();
  if (img.complete && img.naturalWidth === 0) sembunyikan();
  else img.addEventListener("error", sembunyikan);
});


// ---------- 5. TAHUN DI FOOTER ----------
document.getElementById("tahun").textContent = new Date().getFullYear();


// ---------- MULAI ----------
perbaruiTombolTema();
tampilkanHalaman();
