import { Terminal, Server, Shield, Lock } from "lucide-react";

export const NAV_LINKS = [
  { name: "Beranda", href: "/" },
  { name: "Event", href: "/events" },
  { name: "Blog", href: "/blog" },
];

export const CONTRIBUTORS = [
  {
    name: "Fathur Wiriansyah",
    role: "DevSecOps | IT Infrastructure",
    avatar: "https://picsum.photos/seed/neo/200/200",
    github: "https://github.com/Wrianzz",
    linkedin: "https://id.linkedin.com/in/fathurw"
  },
  {
    name: "Joenery Pratama",
    role: "Security Engineer | AI Enthusiast",
    avatar: "https://picsum.photos/seed/cloud/200/200",
    github: "https://github.com/KazehuntGit",
    linkedin: "https://id.linkedin.com/in/joenerypratama"
  },
  {
    name: "Putri Syajah",
    role: "AI/ML Engineer | IT GRC",
    avatar: "https://picsum.photos/seed/sysadmin/200/200",
    github: "#",
    linkedin: "#"
  },
  {
    name: "M Reza Pahlevi",
    role: "Security Engineer | CTF Enthusiast",
    avatar: "https://picsum.photos/seed/cipher/200/200",
    github: "#",
    linkedin: "#"
  },
  {
    name: "Raihan Julyandri",
    role: "Network Security | CTF Enthusiast",
    avatar: "https://picsum.photos/seed/cipher/200/200",
    github: "#",
    linkedin: "#"
  },
  {
    name: "M Farhandi Rahim",
    role: "Security Audit | Security Engineer",
    avatar: "https://picsum.photos/seed/cipher/200/200",
    github: "#",
    linkedin: "#"
  },
    {
    name: "M Hafiz Pratama",
    role: "SOC Analyst | Software Engineer",
    avatar: "https://picsum.photos/seed/cipher/200/200",
    github: "#",
    linkedin: "#"
  }
];

export const BLOGS = [
  {
    id: "1",
    title: "Memulai Perjalanan di Dunia Bug Bounty untuk Pemula",
    excerpt: "Panduan praktis untuk pemula yang ingin memahami dan memulai karir sebagai bug hunter dari nol.",
    author: {
      name: "0xNeo",
      avatar: "https://picsum.photos/seed/neo/200/200",
    },
    date: "24 April 2026",
    readTime: "5 min read",
    coverImage: "https://picsum.photos/seed/blog1/1200/600",
    tags: ["Bug Bounty", "Beginner", "Web Security"],
    content: [
      { type: 'p', text: 'Dunia keamanan siber terus berkembang seiring dengan meningkatnya ancaman digital. Salah satu jalan masuk yang paling menarik dan menguntungkan bagi para penggemar keamanan adalah melalui Bug Bounty. Program ini adalah cara bagi perusahaan untuk menghargai para peneliti keamanan (white-hat hackers) yang berhasil menemukan dan melaporkan kerentanan di sistem mereka sebelum dieksploitasi oleh pihak yang tidak bertanggung jawab.' },
      { type: 'h2', text: 'Mengapa Bug Bounty?' },
      { type: 'p', text: 'Selain mendapatkan imbalan finansial yang menarik, Bug Bounty menawarkan kebebasan tak terbatas. Anda dapat bekerja dari mana saja, kapan saja, dan memilih target apa saja yang menurut Anda menantang. Selain itu, Anda akan mendapatkan pengakuan komunitas dan kesempatan untuk memperdalam pemahaman tentang arsitektur perangkat lunak skala besar.' },
      { type: 'h2', text: 'Langkah Pertama' },
      { type: 'p', text: 'Jangan langsung melompat ke target yang sulit. Mulailah dengan mempelajari dasar-dasar web security seperti OWASP Top 10. Pahami bagaimana HTTP bekerja, pelajari tentang SQL Injection, Cross-Site Scripting (XSS), dan Insecure Direct Object References (IDOR). Anda bisa menggunakan platform seperti PortSwigger Web Security Academy yang menyediakan materi gratis dan laboratorium interaktif.' },
      { type: 'quote', text: '"Meretas bukanlah tentang alat yang Anda gunakan, melainkan seberapa dalam Anda memahami sistem yang ingin Anda bongkar." — Anonymous' },
      { type: 'p', text: 'Konsistensi adalah kuncinya. Tidak ada bug hunter yang sukses dalam semalam. Banyaklah membaca write-up (laporan kerentanan) dari hunter lain untuk mengetahui pola pikir mereka saat berhadapan dengan sebuah aplikasi.' }
    ]
  },
  {
    id: "2",
    title: "Membangun Pipeline DevSecOps Secara Otomatis",
    excerpt: "Langkah-langkah efisien mengotomatisasi pemindaian keamanan di pipeline CI/CD menggunakan alat open-source.",
    author: {
      name: "SysAdminX",
      avatar: "https://picsum.photos/seed/sysadmin/200/200",
    },
    date: "12 April 2026",
    readTime: "7 min read",
    coverImage: "https://picsum.photos/seed/blog2/1200/600",
    tags: ["DevSecOps", "CI/CD", "Automation"],
    content: [
      { type: 'p', text: 'Dalam era pengembangan perangkat lunak yang cepat (Agile), keamanan sering kali menjadi hambatan yang paling sering tertinggal. Di sinilah DevSecOps masuk. Konsep ini adalah tentang mengintegrasikan proses keamanan sejak awal mulainya siklus hidup pengembangan perangkat lunak (Shift-Left).' },
      { type: 'h2', text: 'Otomatisasi adalah Kunci' },
      { type: 'p', text: 'Meminta developer untuk menjalankan pemindaian keamanan secara manual di alat terpisah tidaklah masuk akal. Untuk menjaga agar tim tetap produktif, alat keamanan harus masuk ke lingkungan tempat developer biasa hidup — pipeline CI/CD (seperti GitHub Actions, GitLab CI, dll).' },
      { type: 'h2', text: 'Alat Open Source yang Bisa Digunakan' },
      { type: 'p', text: 'Anda dapat memulai dengan beberapa pemindai gratis yang cukup mumpuni. Contohnya: SonarQube untuk SAST (Static Application Security Testing) untuk memindai kebersihan dan celah di source code, lalu Trivy untuk pemindaian container (Docker image), dan OWASP ZAP untuk DAST (Dynamic Application Security Testing) di tahap post-deployment.' },
      { type: 'quote', text: 'Keamanan perangkat lunak harus tersembunyi, mulus, dan tidak memperlambat arus peluncuran fitur baru.' },
      { type: 'p', text: 'Jika Anda dapat membuat prosesnya mulus, para developer bahkan tidak akan menyadari bahwa kode mereka sedang diuji di latar belakang sampai mereka menerima sebuah notifikasi otomatis (misal di Slack) yang mencegah kode berisiko bergabung dengan basis main branch.' }
    ]
  },
  {
    id: "3",
    title: "Miskonsepsi Penggunaan VPN dan Privasi di Internet",
    excerpt: "Apakah VPN benar-benar melindungi 100% privasi Anda? Membedah mitos pemasaran perusahaan VPN modern.",
    author: {
      name: "CipherM",
      avatar: "https://picsum.photos/seed/cipher/200/200",
    },
    date: "28 Maret 2026",
    readTime: "4 min read",
    coverImage: "https://picsum.photos/seed/blog3/1200/600",
    tags: ["Privacy", "VPN", "OpSec"],
    content: [
      { type: 'p', text: 'Banyak dari kita dihujani oleh iklan VPN di Youtube atau platform lainnya yang secara agresif mengklaim dapat memberikan "100% privasi dan anonimitas online bertingkat kebal retasan keamanan militer". Sayangnya, realita teknisnya tidak semanis janji manis tim marketing.' },
      { type: 'h2', text: 'VPN Bukanlah Cloak of Invisibility' },
      { type: 'p', text: 'Secara teknis, VPN (Virtual Private Network) bekerja dengan mengubah arah lalu lintas internent Anda agar disalurkan terlebih dahulu ke server milik perusahaan VPN sebelum ke internet. ISP lokal (Indihome, Biznet, dll) hanya akan melihat lalu lintas acak yang terenkripsi alih-alih situs web persis yang Anda pantau.' },
      { type: 'p', text: 'Namun ironinya, privasi Anda tidak tersegel dengan ajaib, kendali privasi Anda justru hanya DIPINDAHKAN kelolanya dari tangan penyedia layanan internet Anda bergeser jauh ke kantong data perusahaan VPN. Fakta teknis menegaskan: Anda masih terhubung ke entitas yang dapat melihat seluruh traffic Anda (perusahaan VPN itu sendiri).' },
      { type: 'h2', text: 'Kapan Sebaiknya Menggunakan VPN?' },
      { type: 'p', text: 'Gunakan VPN jika Anda terhubung lewat WiFi publik rawan penyadapan (seperti di Cafe), saat berniat menghindari pembatasan letak geolokasi streaming video, atau menjauhi penyensoran internet ringan. Namun ingat, ancaman pelacakan modern berbasis "Browser Fingerprinting", Cookie lintas situs web, dan kebiasaan digital yang buruk tetap bebas berkeliaran melampaui VPN Anda.' }
    ]
  }
];
