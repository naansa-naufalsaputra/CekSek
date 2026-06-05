'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Bell, 
  Wallet, 
  Star, 
  Store, 
  ShoppingBag, 
  ChevronRight, 
  LogOut, 
  AlertTriangle, 
  ArrowLeft, 
  HelpCircle, 
  Check, 
  X, 
  Plus,
  Compass,
  FileText,
  UserCheck,
  Building,
  Upload,
  Coins,
  History,
  CheckCircle,
  Users,
  SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Product Interface
interface Product {
  id: string;
  title: string;
  price: number;
  seller: string;
  category: string;
  image: string;
  description: string;
  sellerImage: string;
  verified: boolean;
}

export default function Page() {
  // Navigation tabs State
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'transactions' | 'profile'>('home');
  const [homeSubTab, setHomeSubTab] = useState<'landing' | 'catalog'>('landing');
  const [simMode, setSimMode] = useState<'traditional' | 'ceksek'>('ceksek');
  const [simStep, setSimStep] = useState<number>(1);
  
  // Custom states for dynamic interactions
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Custom balance state
  const [walletBalance, setWalletBalance] = useState<number>(650000);
  
  // Stepper state for Transaction status (Step 1-4)
  // Step 3: Warranty ongoing. If completed, moves to 4.
  const [transactionStep, setTransactionStep] = useState<number>(3);
  
  // Timer Countdown state (starts at 6 days, 14 hours, 20 mins)
  const [timeLeft, setTimeLeft] = useState({
    days: 6,
    hours: 14,
    minutes: 20,
    seconds: 45
  });

  // Modal Control States
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showComplainModal, setShowComplainModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [showJualanModal, setShowJualanModal] = useState(false);
  const [showRiwayatModal, setShowRiwayatModal] = useState(false);
  const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);
  const [showBantuanModal, setShowBantuanModal] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  


  // New listing form state
  const [newListing, setNewListing] = useState({
    title: '',
    price: '',
    category: 'Buku Kuliah',
    description: '',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600'
  });

  // Default Products database
  const [productsList, setProductsList] = useState<Product[]>([
    {
      id: 'prod-1',
      title: 'Calculus Textbook',
      price: 50000,
      seller: 'Budi Santoso',
      category: 'Buku Kuliah',
      image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=600',
      description: 'Buku Kalkulus edisi terbaru untuk perkuliahan Fakultas Teknik semester 1 & 2. Kondisi sangat terawat 90% mulus, bersih dari coretan atau highlighter. Disertai latihan soal ujian.',
      sellerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-2',
      title: 'Used Monitor IPS 24"',
      price: 650000,
      seller: 'Siti Aminah',
      category: 'Elektronik (Laptop/HP)',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
      description: 'Monitor IPS 24-inch resolusi Full HD dengan visual tajam, refresh rate 75Hz nyaman untuk coding ataupun gaming tipis. Lengkap dengan dudukan stand, kabel HDMI orisinil, dan adaptor listrik.',
      sellerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-3',
      title: 'Lampu Belajar IKEA',
      price: 75000,
      seller: 'Andi Pratama',
      category: 'Perabotan Kos',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
      description: 'Lampu belajar desk lamp industrial dengan arm fleksibel yang bisa ditekuk sesuai fokus cahaya. Sangat awet, model estetik cocok untuk penataan meja kos modern. Gratis lampu bohlam LED hemat energi.',
      sellerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-4',
      title: 'Kamera DSLR Canon 1200D',
      price: 1800000,
      seller: 'Rivaldo Sitorus',
      category: 'Elektronik (Laptop/HP)',
      image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=600',
      description: 'Kamera pemula DSLR jepretan jernih cocok untuk mata kuliah fotografi dasar. Kelengkapan lensa kit 18-55mm, baterai awet, charger, dan tas gratis. Ada sedikit jamur tipis di lensa luar.',
      sellerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-5',
      title: 'Meja Lipat Belajar Praktis',
      price: 35000,
      seller: 'Indah Kusuma',
      category: 'Perabotan Kos',
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=600',
      description: 'Meja lipat lantai portabel untuk pengerjaan tugas di ranjang atau karpet kos. Kuat menahan beban laptop hingga 15-inch, memiliki slot dudukan gelas tablet terintegrasi.',
      sellerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-6',
      title: 'Buku Pemrograman Web JS',
      price: 60000,
      seller: 'David',
      category: 'Buku Kuliah',
      image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=600',
      description: 'Buku referensi komprehensif HTML, CSS, JavaScript Modern, dan Next.js. Sangat menunjang mata kuliah Pemrograman Web Teknik Informatika. Kondisi halaman lengkap tanpa terlipat.',
      sellerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-7',
      title: 'Keyboard Mechanical Ajazz AK33',
      price: 180000,
      seller: 'Reza Pahlevi',
      category: 'Elektronik (Laptop/HP)',
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
      description: 'Keyboard mechanical TKL layout 82 tombol. Blue Switch tactile dan kliky, sangat seru untuk dipakai ngetik tugas atau coding. LED backlight putih elegan, koneksi kabel USB mulus dicolok ke laptop.',
      sellerImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-8',
      title: 'Rice Cooker Cosmos 0.8L',
      price: 120000,
      seller: 'Lulu Aprilia',
      category: 'Perabotan Kos',
      image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600',
      description: 'Rice Cooker mini kapasitas 0.8 Liter, sangat pas untuk anak kos. Bisa masak nasi, mengukus, dan menghangatkan lauk. Kondisi panci teflon anti lengket masih mulus 85%, siap pakai.',
      sellerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-9',
      title: 'Buku Pengantar Statistika',
      price: 45000,
      seller: 'Dewi Lestari',
      category: 'Buku Kuliah',
      image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&q=80&w=600',
      description: 'Buku Pengantar Statistika edisi ketiga oleh Walpole. Cocok untuk mahasiswa angkatan muda yang menempuh matakuliah statistika dasar/metode penelitian. Keadaan isi mulus tanpa robek.',
      sellerImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-10',
      title: 'Mouse Wireless Logitech M350',
      price: 110000,
      seller: 'Fajar Nugroho',
      category: 'Elektronik (Laptop/HP)',
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
      description: 'Mouse wireless minimalis dan silent click, sangat tenang tidak berisik saat dipakai di perpustakaan. Bisa koneksi Dual Mode (Bluetooth dan USB Receiver). Lengkap dengan box aslinya.',
      sellerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-11',
      title: 'Kipas Angin Berdiri Miyako',
      price: 95000,
      seller: 'Bambang Wijaya',
      category: 'Perabotan Kos',
      image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?auto=format&fit=crop&q=80&w=600',
      description: 'Kipas angin berdiri ukuran 16 inch. Anginnya super kencang, tidak berisik, sangat ampuh mengusir hawa panas di siang hari di kosan Semarang. Tombol speed 1-3 berfungsi normal.',
      sellerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-12',
      title: 'Kamus Saku Inggris-Indonesia',
      price: 25000,
      seller: 'Intan Permata',
      category: 'Buku Kuliah',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      description: 'Kamus saku tebal dan praktis untuk dibawa kuliah sehari-hari. Rekomendasi wajib mahasiswa jurusan sastra/pendidikan bahasa inggris ataupun umum untuk nambah kosakata baru.',
      sellerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-13',
      title: 'Headphone Wireless Sony CH510',
      price: 320000,
      seller: 'Diana Putri',
      category: 'Elektronik (Laptop/HP)',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600',
      description: 'Headphone wireless Sony On-Ear warna hitam. Suara bass mantap, baterai tahan sangat lama hingga 35 jam pemakaian, mic aman banget buat Zoom meeting kuliah online atau dengerin musik waktu nugas.',
      sellerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-14',
      title: 'Rak Sepatu Kayu Susun 4',
      price: 65000,
      seller: 'Bagas Wibowo',
      category: 'Perabotan Kos',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=600',
      description: 'Rak sepatu minimalis terbuat dari kayu pinus halus, muat sampai 12 pasang sepatu dan sandal. Sangat ringkas untuk dipasang di lorong depan pintu kamar kos Anda agar rapi.',
      sellerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-15',
      title: 'Buku Algoritma & Struktur Data',
      price: 55000,
      seller: 'Satria Tama',
      category: 'Buku Kuliah',
      image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
      description: 'Buku teks fundamental pemrograman Algoritma & Struktur Data C++/Java. Bahas konsep array, stack, queue, linked list, tree, hingga sorting algorithms secara runtut. Sangat direkomendasikan untuk mahasiswa Ilmu Komputer / IT.',
      sellerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-16',
      title: 'Powerbank Anker PowerCore 10000mAh',
      price: 150000,
      seller: 'Amanda Lestari',
      category: 'Elektronik (Laptop/HP)',
      image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&q=80&w=600',
      description: 'Powerbank ultra ringkas kapasitas 10000mAh warna hitam doff. Pengisian daya cepat (PowerIQ), sangat berguna untuk cadangan baterai smartphone selama seharian penuh di kampus UNNES.',
      sellerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-17',
      title: 'Dispenser Air Minum Miyako',
      price: 85000,
      seller: 'Rio Febrian',
      category: 'Perabotan Kos',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=600',
      description: 'Dispenser meja hemat energi (low watt) untuk air galon atas. Dua keran penyaji (normal dan panas/hot), berfungsi normal tanpa bocor. Bodi kokoh bersih dari noda bandel, hemat space kos.',
      sellerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-18',
      title: 'Buku Kamus Besar Bahasa Indonesia (KBBI)',
      price: 75000,
      seller: 'Indira Salsabila',
      category: 'Buku Kuliah',
      image: 'https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&q=80&w=600',
      description: 'Buku KBBI edisi fisik lengkap terbal tebal. Sangat mendukung pengerjaan tugas akhir, penyusunan esai ilmiah, dan penulisan skripsi mahasiswa Bahasa dan Sastra. Kondisi kertas bersih terawat.',
      sellerImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-19',
      title: 'Router TP-Link WR840N Wifi',
      price: 90000,
      seller: 'Doni Darmawan',
      category: 'Elektronik (Laptop/HP)',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600',
      description: 'Router Wifi TP-Link 300Mbps dengan dua antena penangkap sinyal kuat. Sangat cocok dipasang di kamar kosan untuk sharing paket internet bulanan bersama teman-teman seperjuangan.',
      sellerImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      verified: true
    },
    {
      id: 'prod-20',
      title: 'Hanger Gantungan Baju Stainless (Isi 10)',
      price: 15000,
      seller: 'Gita Safitri',
      category: 'Perabotan Kos',
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=600',
      description: 'Satu set gantungan baju (10 pcs) bahan stainless steel murni anti karat dan anti patah. Bermanfaat merapikan laundry luar atau menjemur pakaian kuliah di balkon/teras kos.',
      sellerImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150',
      verified: true
    }
  ]);

  // Live timer tick implementation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              } else {
                clearInterval(timer);
                return prev;
              }
            }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format countdown string
  const formattedCountdown = useMemo(() => {
    const d = String(timeLeft.days).padStart(2, '0');
    const h = String(timeLeft.hours).padStart(2, '0');
    const m = String(timeLeft.minutes).padStart(2, '0');
    const s = String(timeLeft.seconds).padStart(2, '0');
    return `${d} Hari : ${h} Jam : ${m} Menit : ${s} Detik`;
  }, [timeLeft]);

  // Handle trigger toast notifications
  const triggerToast = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 4000);
  };

  // Switch category pills helper
  const filteredProducts = useMemo(() => {
    return productsList.filter(item => {
      const matchCategory = selectedCategory === 'Semua Kategori' || item.category.toLowerCase().includes(selectedCategory.split(' ')[0].toLowerCase());
      const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [productsList, selectedCategory, searchQuery]);

  // Handles adding new listing from form
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListing.title || !newListing.price) {
      triggerToast('Mohon lengkapi Judul Barang dan Harga.');
      return;
    }
    const priceNum = Number(newListing.price.replace(/[^0-9]/g, ''));
    if (isNaN(priceNum) || priceNum <= 0) {
      triggerToast('Harga yang dimasukkan tidak valid.');
      return;
    }

    const newItem: Product = {
      id: `prod-${Date.now()}`,
      title: newListing.title,
      price: priceNum,
      seller: 'David', // Custom seller match profile
      category: newListing.category,
      image: newListing.category === 'Buku Kuliah' 
        ? 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=600'
        : newListing.category.includes('Elektronik')
          ? 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600'
          : 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600',
      description: newListing.description || 'Barang milik pribadi, dijual cepat karena sudah selesai masa kuliah.',
      sellerImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
      verified: true
    };

    setProductsList(prev => [newItem, ...prev]);
    setShowSellModal(false);
    setNewListing({
      title: '',
      price: '',
      category: 'Buku Kuliah',
      description: '',
      image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=600'
    });
    triggerToast('Sukses! Barang dagangan Anda berhasil diiklankan di Ceksek.');
  };

  // Withdraw simulation handler
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawBank, setWithdrawBank] = useState('UNNES Bank Mandiri - 134000305820');
  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const withdrawVal = Number(withdrawAmount);
    if (!withdrawVal || withdrawVal <= 0) {
      triggerToast('Harap masukan jumlah nominal penarikan yang valid.');
      return;
    }
    if (withdrawVal > walletBalance) {
      triggerToast('Saldo Ceksek Wallet Anda tidak mencukupi.');
      return;
    }
    
    setWalletBalance(prev => prev - withdrawVal);
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    triggerToast(`Penarikan dana Rp ${withdrawVal.toLocaleString('id-ID')} telah diproses menuju rekening Anda.`);
  };

  // Escrow actions simulation handlers
  const handleReleaseEscrow = () => {
    setTransactionStep(4);
    // Add item price to target wallet or simulate payout completion
    triggerToast('Escrow Berhasil Dicairkan! Dana sebesar Rp 650.000 telah dilepas ke Siti Aminah.');
  };

  const [complainText, setComplainText] = useState('');
  const handleComplain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complainText.trim()) {
      triggerToast('Masukan alasan komplain secara rinci.');
      return;
    }
    setShowComplainModal(false);
    setComplainText('');
    triggerToast('Komplain Anda telah terdaftar. Kami menangguhkan pelepasan dana sampai verifikasi berkas bukti.');
  };

  return (
    <div id="ceksek-app-root" className="min-h-screen flex flex-col justify-between selection:bg-blue-100 selection:text-blue-900">
      
      {/* Dynamic Toast Alerts Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            id="toast-notification-banner"
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#0b1c30] text-white px-6 py-4 rounded-xl shadow-xl border border-blue-500/30 flex items-center gap-3 w-[90%] max-w-lg"
          >
            <Shield className="text-amber-400 shrink-0 w-6 h-6 animate-pulse" />
            <span className="font-medium text-sm leading-relaxed">{showNotification}</span>
            <button onClick={() => setShowNotification(null)} className="ml-auto text-gray-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      {!hasEnteredApp ? (
        <header id="ceksek-landing-navbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <div 
              id="navbar-brand-logo"
              className="cursor-pointer flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-[#00288e] rounded-xl flex items-center justify-center text-white shadow-md select-none transform hover:rotate-6 transition-all duration-300">
                <Shield className="w-6 h-6 fill-amber-350 stroke-white" />
              </div>
              <span className="text-2xl font-black text-[#00288e] tracking-tight">
                Ceksek
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-6 text-xs text-gray-500 font-bold">
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-100 shadow-sm"><Check className="w-4 h-4 text-emerald-600 stroke-[3.5]" /> NIM &amp; SIKADU UNNES Terverifikasi</span>
              <span className="flex items-center gap-1.5 bg-blue-50 text-[#00288e] px-3 py-1 rounded-full border border-blue-100 shadow-sm"><Check className="w-4 h-4 text-[#00288e] stroke-[3.5]" /> Rekber Escrow 100% Bebas Scam</span>
            </div>
          </div>
          
          <button 
            onClick={() => { setHasEnteredApp(true); setActiveTab('home'); setHomeSubTab('catalog'); }}
            className="px-6 py-2.5 bg-[#00288e] text-white hover:bg-blue-800 transition-all rounded-xl font-black text-xs shadow-md shadow-blue-950/10 active:scale-95 duration-100"
          >
            Masuk Aplikasi &rarr;
          </button>
        </header>
      ) : (
        <header id="ceksek-topbar" className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all py-4 px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-12">
            {/* Logo brand */}
            <div 
              id="navbar-brand-logo"
              onClick={() => { setActiveTab('home'); setHomeSubTab('catalog'); setSelectedProduct(null); }}
              className="cursor-pointer flex items-center gap-2"
            >
              <div className="w-10 h-10 bg-[#00288e] rounded-xl flex items-center justify-center text-white shadow-md">
                <Shield className="w-6 h-6 fill-amber-350 stroke-white" />
              </div>
              <span className="text-2xl font-black text-[#00288e] tracking-tight hover:opacity-90 transition-opacity">
                Ceksek
              </span>
            </div>

            {/* Desktop Links Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                id="nav-home-btn"
                onClick={() => { setActiveTab('home'); setHomeSubTab('catalog'); setSelectedProduct(null); }}
                className={`font-semibold text-sm transition-all pb-1 border-b-2 relative ${
                  activeTab === 'home' 
                    ? 'text-[#00288e] border-[#00288e]' 
                    : 'text-gray-500 border-transparent hover:text-black'
                }`}
              >
                Katalog Barang
              </button>
              <button 
                id="nav-transactions-btn"
                onClick={() => { setActiveTab('transactions'); setSelectedProduct(null); }}
                className={`font-semibold text-sm transition-all pb-1 border-b-2 relative ${
                  activeTab === 'transactions' 
                    ? 'text-[#00288e] border-[#00288e]' 
                    : 'text-gray-500 border-transparent hover:text-black'
                }`}
              >
                Transaksi Proteksi
                {transactionStep === 3 && (
                  <span className="absolute -top-1 -right-2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                )}
              </button>
              <button 
                id="nav-profile-btn"
                onClick={() => { setActiveTab('profile'); setSelectedProduct(null); }}
                className={`font-semibold text-sm transition-all pb-1 border-b-2 relative ${
                  activeTab === 'profile' 
                    ? 'text-[#00288e] border-[#00288e]' 
                    : 'text-gray-500 border-transparent hover:text-black'
                }`}
              >
                Profil Saya
              </button>
            </nav>
          </div>

          {/* Right Nav Utilities */}
          <div className="flex items-center gap-4">
            {/* Search trigger */}
            <div className="relative hidden lg:block w-72">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                type="text" 
                placeholder="Cari kebutuhan kuliah..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'home') setActiveTab('home');
                }}
                className="w-full text-xs pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#00288e] focus:bg-white transition-all text-gray-800"
              />
            </div>

            <button 
              onClick={() => triggerToast("Pemberitahuan Terkini: Transaksi monitor #CS-98241 saat ini dilindungi dalam masa garansi 7 Hari.")}
              className="p-2.5 hover:bg-gray-100 rounded-full transition-colors relative"
              title="Notification Hub"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#ba1a1a] rounded-full border-2 border-white" />
            </button>

            {/* User profile avatar display */}
            <button 
              onClick={() => { setActiveTab('profile'); setSelectedProduct(null); }}
              className="flex items-center gap-2 border border-gray-200 hover:border-[#00288e] p-1 pr-3 rounded-full bg-gray-50 transition-all active:scale-95"
              title="Akun Saya"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-inner shrink-0">
                <img 
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" 
                  alt="David avatar preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="hidden sm:inline font-semibold text-xs text-[#0b1c30]">
                David
              </span>
            </button>
          </div>
        </header>
      )}

      {/* Main Container Workspace */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8">
        
        {/* Dynamic Screen Renders */}
        <AnimatePresence mode="wait">
          
          {/* SIKADU & NIM Verified Landing or inside app screens */}
          {!hasEnteredApp ? (
            /* BRAND NEW LANDING VIEW */
            <motion.div
              key="landing-page"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="space-y-16"
              id="ceksek-landing-page-root"
            >
              {/* Hero Head Banner */}
              <div className="bg-gradient-to-br from-[#eff4ff] via-white to-blue-50/40 border border-blue-105 rounded-3xl p-8 md:p-14 relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-12 text-left">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-200/10 rounded-full blur-2xl pointer-events-none" />

                <div className="z-10 space-y-6 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 bg-blue-100 text-[#00288e] font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-blue-200/50">
                    <Shield className="w-3.5 h-3.5 fill-blue-200" />
                    Platform Resmi Mahasiswa UNNES
                  </span>

                  <div className="space-y-3">
                    <h1 className="text-4xl md:text-5xl font-black text-[#0b1c30] tracking-tight leading-none">
                      Beli Barang Bekas Kampus, <span className="text-[#00288e]">100% Aman.</span>
                    </h1>
                    <p className="text-gray-500 text-sm md:text-base leading-relaxed font-medium">
                      Uang Kembali dalam 7 Hari. Transaksi aman khusus area kampus dengan fitur escrow terintegrasi NIM mahasiswa Universitas Negeri Semarang.
                    </p>
                  </div>

                  {/* Dynamic Interactive Call to Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                    <button 
                      onClick={() => { setHasEnteredApp(true); setActiveTab('home'); setHomeSubTab('catalog'); }}
                      className="px-8 py-4 bg-[#00288e] text-white hover:bg-blue-800 transition-all rounded-2xl font-black text-sm shadow-lg shadow-blue-900/10 active:scale-95 duration-100 flex items-center justify-center gap-2"
                    >
                      Mulai Belanja Dengan Aman
                      <ArrowRight className="w-5 h-5 shrink-0" />
                    </button>
                    <button 
                      onClick={() => {
                        // Directly enters transaction simulation demo
                        setHasEnteredApp(true);
                        setActiveTab('transactions');
                        setTransactionStep(3);
                        triggerToast('Demo Proteksi Transaksi Terkini Anda Diaktifkan!');
                      }}
                      className="px-7 py-4 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-bold text-sm rounded-2xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      Coba Transaksi Demo &rarr;
                    </button>
                  </div>
                </div>

                {/* High Fidelity Banner visual mock status */}
                <div className="w-full lg:w-[420px] bg-white border border-gray-100 rounded-3xl p-6 shadow-xl relative z-10 space-y-4">
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#00288e] flex items-center gap-1.5 shadow-md border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                    SIKADU Verified
                  </div>

                  <div className="space-y-1.5 text-left border-b border-gray-50 pb-4">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">Status Escrow Aktif</span>
                    <h3 className="font-extrabold text-sm text-gray-955">Used Monitor IPS 24&quot;</h3>
                    <div className="text-xl font-black text-[#00288e]">Rp 650.000</div>
                  </div>

                  {/* Horizontal mini workflow steps view */}
                  <div className="space-y-4 text-left">
                    <div className="flex gap-3 text-xs leading-snug">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">✓</div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-xs">Pencairan Dana Ditangguhkan</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Dana pembeli terkuci aman dalam brankas Ceksek selama masa pengujian.</p>
                      </div>
                    </div>
                    <div className="flex gap-3 text-xs leading-snug">
                      <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold font-mono text-[10px] shrink-0 mt-0.5">3</div>
                      <div>
                        <h4 className="font-extrabold text-gray-900 text-xs text-amber-600">Garansi Meetup 7 Hari Berjalan</h4>
                        <p className="text-[10px] text-gray-400 mt-0.5">Pembeli berhak mengetes barang di kosan sebelum menyetujui transaksi.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kampus Trust Badges Section */}
              <section className="bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100 text-left">
                  {/* Badge 1 */}
                  <div className="flex items-start gap-4 md:px-4">
                    <div className="p-3.5 bg-blue-50 text-[#00288e] rounded-2xl border border-blue-100">
                      <Shield className="w-6 h-6 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">Verifikasi NIM &amp; SIKADU</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Semua penjual terverifikasi lewat NIM dan akun SIKADU UNNES aktif.</p>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className="flex items-start gap-4 pt-6 md:pt-0 md:px-8">
                    <div className="p-3.5 bg-yellow-50 text-amber-650 rounded-2xl border border-yellow-105 text-amber-750">
                      <Coins className="w-6 h-6 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">COD Aman Terproteksi</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Tak perlu serahkan duit di tempat sepi. Check out dulu, meetup tenang.</p>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className="flex items-start gap-4 pt-6 md:pt-0 md:px-8">
                    <div className="p-3.5 bg-purple-50 text-purple-650 rounded-2xl border border-purple-105 text-purple-600">
                      <Users className="w-6 h-6 shrink-0" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900">Pencegahan Fraud Terpadu</h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">Penipu tidak bisa berkutik karena rekening bank terikat identitas mahasiswa.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* INTERACTIVE ESCROW SIMULATION PLAYGROUND */}
              <section className="space-y-6" id="escrow-simulation-playground">
                <div className="text-center space-y-2">
                  <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Simulasi Interaktif Bergaransi</span>
                  <h2 className="text-3xl font-extrabold text-gray-900">Uji Keamanan Transaksi Ceksek</h2>
                  <p className="text-gray-500 text-sm max-w-xl mx-auto">Klik salah satu metode pembayaran di bawah untuk memutar simulasi skenario percakapan COD kampus dan sengketa dana secara real-time.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4 text-left">
                  {/* Control Panel Simulator */}
                  <div className="lg:col-span-5 bg-white border border-gray-150 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-black text-sm text-[#011a41] uppercase tracking-wider">Metode Pembayaran</h4>
                      <p className="text-xs text-gray-400 leading-normal">Bandingkan bagaimana uang saku Anda terlindung bersama ekosistem Ceksek, dibanding jalur transfer tradisional luar:</p>
                      
                      <div className="space-y-3 pt-2">
                        {/* Option 1: Traditional Transfer */}
                        <button
                          onClick={() => { setSimMode('traditional'); setSimStep(1); triggerToast("Skenario: Transfer Langsung di Luar Rekber"); }}
                          className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all outline-none ${
                            simMode === 'traditional'
                              ? 'border-red-500 bg-red-50/20 text-red-950 shadow-sm'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                          }`}
                        >
                          <div className={`p-2 rounded-xl border shrink-0 ${simMode === 'traditional' ? 'bg-red-50 border-red-200 animate-pulse' : 'bg-white border-gray-200'}`}>
                            <X className="w-5 h-5 text-red-500" />
                          </div>
                          <div>
                            <div className="font-extrabold text-xs tracking-wide uppercase text-red-800">Transfer Langsung (Bahaya DP)</div>
                            <div className="text-[11px] text-gray-500 mt-1 leading-normal">Membayar langsung ke dompet pribadi penjual asing di FJB Sosmed demi mengunci diskon bohong.</div>
                          </div>
                        </button>

                        {/* Option 2: Ceksek Escrow */}
                        <button
                          onClick={() => { setSimMode('ceksek'); setSimStep(1); triggerToast("Skenario: Rekber Proteksi Ceksek Escrow"); }}
                          className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all outline-none ${
                            simMode === 'ceksek'
                              ? 'border-emerald-500 bg-emerald-50/20 text-emerald-950 shadow-sm'
                              : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'
                          }`}
                        >
                          <div className={`p-2 rounded-xl border shrink-0 ${simMode === 'ceksek' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
                            <Shield className="w-5 h-5 text-emerald-650 fill-emerald-100" />
                          </div>
                          <div>
                            <div className="font-extrabold text-xs tracking-wide uppercase text-emerald-850">Ceksek Rekber Escrow</div>
                            <div className="text-[11px] text-gray-500 mt-1 leading-normal">Dana dikunci sistem Ceksek Kampus. Selama 7 hari garansi berjalan, dana aman, retur dijamin 100%.</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Steps Indicators */}
                    <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-black text-gray-450 tracking-wider">Tahapan Alur</span>
                        <span className="font-mono text-xs font-bold text-[#00288e]">{simStep} dari 4</span>
                      </div>
                      <div className="flex gap-1.5 h-1 px-0.5">
                        {[1, 2, 3, 4].map((stepNum) => (
                          <button
                            key={stepNum}
                            onClick={() => setSimStep(stepNum)}
                            className={`flex-grow h-full rounded transition-all outline-none ${
                              stepNum <= simStep 
                                ? simMode === 'traditional' ? 'bg-red-500' : 'bg-emerald-500'
                                : 'bg-gray-400/20'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between gap-2 pt-1.5">
                        <button
                          disabled={simStep === 1}
                          onClick={() => setSimStep(prev => prev - 1)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 font-bold text-[10px] text-gray-650 hover:bg-gray-50 transition-colors disabled:opacity-40"
                        >
                          Sebelumnya
                        </button>
                        <button
                          disabled={simStep === 4}
                          onClick={() => setSimStep(prev => prev + 1)}
                          className="px-4 py-1.5 rounded-lg bg-gray-900 text-white font-extrabold text-[10px] hover:bg-black transition-all disabled:opacity-40 flex items-center gap-1"
                        >
                          Selanjutnya <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Smartphone Chat Frame Simulator Display */}
                  <div className="lg:col-span-7 bg-[#0b1c35] text-gray-100 rounded-3xl p-6 shadow-xl relative border border-blue-900/40 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Mock Chat Header */}
                    <div className="flex items-center justify-between pb-3.5 border-b border-gray-850 relative z-10 text-left">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-600 shrink-0 border border-gray-750">
                          <img 
                            src={
                              simMode === 'traditional'
                                ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
                                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                            } 
                            alt="Seller avatar" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <div className="font-extrabold text-xs text-white flex items-center gap-1">
                            {simMode === 'traditional' ? "Penjual Anonim (FJB Sosial Media)" : "Siti Aminah (Teknik Informatika)"}
                            {simMode === 'ceksek' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950" />}
                          </div>
                          <div className="text-[9px] text-[#b4f0b2] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                            {simMode === 'traditional' ? "Mencari Pembeli di WA/Telegram" : "SIKADU UNNES Terverifikasi"}
                          </div>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase ${simMode === 'traditional' ? 'bg-red-500/20 text-[#ffb4ab]' : 'bg-emerald-500/20 text-[#b4f0b2]'}`}>
                        {simMode === 'traditional' ? 'Kehilangan Rp 100k - Rp 1jt' : 'Proteksi Rekber 100%'}
                      </span>
                    </div>

                    {/* Chat Messages Body Container */}
                    <div className="py-6 space-y-4 flex-grow min-h-[220px] flex flex-col justify-end text-left">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${simMode}-${simStep}`}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          <div className="text-center">
                            <span className="inline-block bg-white/[0.04] text-[10px] text-gray-400 px-3 py-1 rounded-full border border-white/[0.05] font-semibold uppercase">
                              Langkah ke-{simStep}: {
                                simMode === 'traditional' 
                                  ? [
                                      "Cari Barang di Sosmed",
                                      "Minta DP Booking",
                                      "Uang Terkirim Instan",
                                      "Penipu Menghilang (Scam!)"
                                    ][simStep - 1]
                                  : [
                                      "Kunci Dana di Rekber",
                                      "COD Area Kampus",
                                      "Masa Garansi 7 Hari",
                                      "Dana Otomatis Cair"
                                    ][simStep - 1]
                              }
                            </span>
                          </div>

                          {/* Buyer chat message bubble */}
                          <div className="flex gap-2 max-w-[85%] self-start text-left items-start">
                            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-blue-900 bg-gray-50">
                              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150" alt="David avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="bg-blue-600/70 text-white rounded-2xl rounded-tl-none p-3 shadow-md border border-blue-500/20">
                              <span className="block text-[9px] text-blue-200 font-extrabold uppercase tracking-wide mb-0.5 text-left">David (Pembeli)</span>
                              <p className="text-xs leading-relaxed font-normal text-left">
                                {simMode === 'traditional' 
                                  ? [
                                      "Kak, monitor IPS nya masih ada? Bisa COD sore ini?",
                                      "Oh gitu ya kak, alamat COD persisnya mana?",
                                      "Udah saya transfer ya kak DP-nya. Saya meluncur ke lokasi.",
                                      "Kak? Kok nomornya centang satu? Halo?"
                                    ][simStep - 1]
                                  : [
                                      "Halo kak, monitornya sudah saya bayar lewat Rekber Ceksek ya. Dana aman ter-lock di sistem.",
                                      "Saya di teras depan Perpustakaan UNNES kak, pakai jaket abu-abu.",
                                      "Monitor aman kak, sejauh ini lancar jaya buat ngerjain tugas kuliah.",
                                      "Sudah saya klik 'Konfirmasi Selesai' ya kak, dana cair instan ke dompet kakak."
                                    ][simStep - 1]
                                }
                              </p>
                            </div>
                          </div>

                          {/* Seller chat message bubble */}
                          <div className="flex gap-2 max-w-[85%] ml-auto justify-end text-right items-start">
                            <div className="bg-[#122841] text-gray-105 rounded-2xl rounded-tr-none p-3 shadow-md text-left border border-white/[0.03]">
                              <span className="block text-[9px] text-[#f7ad4c] font-extrabold uppercase tracking-wide mb-0.5">
                                {simMode === 'traditional' ? "Penjual Anonim" : "Siti Aminah"}
                              </span>
                              <p className="text-xs leading-relaxed font-normal">
                                {simMode === 'traditional' 
                                  ? [
                                      "Masih dek, mulus terawat no minus. COD langsung di perempatan lingkar luar kampus aja.",
                                      "Transfer DP 100 ribu dulu dek buat jaminan keseriusan biar barang nggak diambil orang lain.",
                                      "Sip dek, sebentar saya cek mutasinya dulu ya.",
                                      "🚫 Nomor Anda telah diblokir. Akun sosial media dihapus."
                                    ][simStep - 1]
                                  : [
                                      "Notifikasi masuk, mantap! Status lunas escrow. Ayok ketemuan buat janjian cek barang.",
                                      "Oke dek, ini saya otw bawa-bawa monitornya. Silakan dites sepuasnya pas ketemu ya.",
                                      "Syukur dech, masa garansi 7 hari berjalan otomatis ya. Kalau ada kendala bilang aja.",
                                      "Transaksi Sukses! Dana masuk dompet digital Ceksek. Terima kasih kerja samanya."
                                    ][simStep - 1]
                                }
                              </p>
                            </div>
                            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-gray-800 border border-gray-700">
                              <img 
                                src={
                                  simMode === 'traditional'
                                    ? "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150"
                                    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
                                } 
                                alt="Seller" 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* Interactive Status Indicator Result */}
                    <div className="border-t border-gray-850 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-left relative z-10">
                      <span className="text-gray-400 font-medium whitespace-nowrap">Analisis Sistem:</span>
                      <span className={`font-semibold bg-white/[0.03] px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 ${
                        simMode === 'traditional' 
                          ? 'text-rose-400 border-red-900/30' 
                          : 'text-[#b4f0b2] border-emerald-950/30'
                      }`}>
                        {simMode === 'traditional' ? (
                          <>
                            <X className="w-4 h-4 text-rose-500 shrink-0" />
                            {[
                              "Menghubungi penjual gadungan yang memasang iklan di grup luar tanpa verifikasi NIM.",
                              "Penjual meminta DP jaminan keseriusan agar diskon tidak melayang ke tangan orang lain.",
                              "Pembeli mentransfer Rp 100.000 secara m-banking langsung ke rekening penipu tanpa escrow.",
                              "Kontak WhatsApp diblokir seketika, akun dihapus. Uang DP melayang sia-sia."
                            ][simStep - 1]}
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            {[
                              "Pembeli melakukan checkout di Ceksek. Dana aman dikunci di rekening penampung escrow Ceksek.",
                              "COD nyaman di area ramai lingkungan kampus (Perpus UNNES) untuk serah terima fisik.",
                              "Pembeli membawa pulang monitor untuk diuji pengerjaan tugas kuliah selama 7 hari penuh.",
                              "Masa pengetesan sukses, dana dilepas ke penjual secara instan tanpa khawatir ditipu."
                            ][simStep - 1]}
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* TIMELINE PROCESS WORKFLOW */}
              <section className="space-y-8 pt-4 text-left">
                <div className="text-center space-y-2">
                  <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Tahapan Transaksi</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Alur Sederhana Rekber Ceksek</h2>
                  <p className="text-gray-500 text-sm max-w-lg mx-auto">Kami merancang proses jual beli sesingkat mungkin tanpa mengorbankan proteksi saldo Anda sedikit pun.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {/* Step 1 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                    <div className="w-10 h-10 bg-blue-50 text-[#00288e] font-black rounded-2xl flex items-center justify-center mb-4 text-xs select-none">
                      01
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1.5">Pilih &amp; Bayar</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Checkout barang di Ceksek. Saldo ditransfer ke rekening penampung resmi pihak ketiga.</p>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                    <div className="w-10 h-10 bg-amber-50 text-amber-600 font-black rounded-2xl flex items-center justify-center mb-4 text-xs select-none">
                      02
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1.5">Kunci Uang</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Selesaikan pembayaran via transfer Escrow Ceksek Aman. Dana tersimpan erat.</p>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-all">
                    <div className="w-10 h-10 bg-purple-50 text-purple-650 font-black rounded-2xl flex items-center justify-center mb-4 text-xs select-none">
                      03
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1.5">COD &amp; Cek</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Lakukan janjian bertemu di area aman lingkungan UNNES, cek kondisi barang dengan teliti.</p>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                    <div className="w-10 h-10 bg-rose-50 text-rose-600 font-black rounded-2xl flex items-center justify-center mb-4 text-xs select-none">
                      04
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1.5">Masa Tes 7 Hari</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Pakai barangnya di kos selama seminggu penuh. Anda terlindung dari kerusakan tersembunyi.</p>
                  </div>

                  {/* Step 5 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-800 font-black rounded-2xl flex items-center justify-center mb-4 text-xs select-none">
                      05
                    </div>
                    <h4 className="font-bold text-sm text-gray-900 mb-1.5">Dana Cair</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Klik cairkan di menu Transaksi untuk melepas dana belanja ke seller setelah lulus test.</p>
                  </div>
                </div>
              </section>

              {/* TESTIMONIALS */}
              <section className="space-y-8 pt-4">
                <div className="text-center space-y-2">
                  <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Testimoni Mahasiswa</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Kata Mahasiswa UNNES Berlangganan</h2>
                  <p className="text-gray-500 text-sm max-w-lg mx-auto">Kami mengumpulkan cerita asli dari teman-teman kampus yang sudah mencicipi sistem proteksi Ceksek.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  {/* Testimonial 1 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                      </div>
                      <p className="text-xs text-gray-655 leading-relaxed font-normal">
                        &ldquo;Beli laptop bekas buat ngerjain skripsi kemarin ngeri banget kalau ditransfer langsung. Lewat Ceksek Escrow, uang ketahan dulu di rekber. Pas meetup di depan Fakultas Ekonomi, sepuasnya saya cek layar LCD dan batrenya. Rekomen banget!&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-6 border-t border-gray-50 mt-6">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shrink-0">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Farhan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-gray-950">Farhan Setiawan</h5>
                        <span className="text-[9px] text-gray-400 font-medium">Ekonomi Pembangunan UNNES</span>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 2 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                      </div>
                      <p className="text-xs text-gray-655 leading-relaxed font-normal">
                        &ldquo;Jual monitor kemarin ga ribet lagi dituduh nipu ato barang rusak. Pembeli juga seneng dapet jaminan masa pelindung 7 hari dari Ceksek. Begitu masanya lewat langsung cair ke rekening saldo saya. Aman dan transparan.&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-6 border-t border-gray-55 mt-6">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shrink-0">
                        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Sarah" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-gray-955">Sarah Amanda</h5>
                        <span className="text-[9px] text-gray-400 font-medium">Teknik Informatika UNNES</span>
                      </div>
                    </div>
                  </div>

                  {/* Testimonial 3 */}
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                      </div>
                      <p className="text-xs text-gray-655 leading-relaxed font-normal">
                        &ldquo;Buat anak kos yang uang bulanan ngepres, beli buku kalkulus &amp; programming bekas jadi andalan. Suka was-was kalo bukunya ternyata lecek parah atau kelipet parah. Di Ceksek dapet seller satu kosan dan ada jaminan retur. Juara!&rdquo;
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-6 border-t border-gray-50 mt-6">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shrink-0">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Irfan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-gray-950">Irfan Hakim</h5>
                        <span className="text-[9px] text-gray-400 font-medium">Pendidikan Biologi UNNES</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA OUTRO */}
              <div className="bg-[#00288e] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/15 rounded-full pointer-events-none animate-pulse" />
                
                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">Yakin Masih Mau Ambil Risiko Jual Beli via Transfer Biasa?</h3>
                  <p className="text-blue-105 text-xs sm:text-sm leading-relaxed opacity-90 max-w-lg mx-auto text-blue-100">
                    Jangan biarkan beasiswa atau kiriman bulanan orang tua melayang sia-sia ke tangan penipu. Masuk ke aplikasi dan temukan produk keinginan Anda sekarang!
                  </p>
                  
                  <button 
                    onClick={() => { setHasEnteredApp(true); setActiveTab('home'); setHomeSubTab('catalog'); triggerToast("Selamat menjelajah katalog barang bekas UNNES!"); }}
                    className="px-8 py-4 bg-amber-400 hover:bg-amber-450 transition-all text-[#001453] rounded-2xl font-black text-sm shadow-md active:scale-95 duration-150 tracking-wider inline-flex items-center justify-center gap-2"
                  >
                    Jelajahi Produk Yang Tersedia Sekarang
                    <ArrowRight className="w-5 h-5 shrink-0" />
                  </button>
                </div>
              </div>

              {/* FAQ ACCORDION SECTION */}
              <section className="space-y-6 pt-4 max-w-3xl mx-auto">
                <div className="text-center space-y-1">
                  <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Tanya Jawab</span>
                  <h3 className="text-xl font-extrabold text-[#0b1c30]">Pertanyaan Umum Ceksek Escrow</h3>
                </div>

                <div className="space-y-4 pt-2 text-left">
                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-inner">
                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">Apakah Ceksek menahan uang selamanya?</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mt-2 font-normal">Tidak. Uang belanja pembeli tersimpan aman sampai pembeli melakukan konfirmasi setuju di menu Transaksi atau batas waktu otomatis garansi 7 hari telah habis, barulah dana diteruskan menuju saldo dompet milik penjual.</p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-inner">
                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">Apa yang terjadi jika barang tidak sesuai saat COD?</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mt-2 font-normal">Jika saat janjian bertemu kondisi fisiknya jauh berbeda dengan deskripsi, pembeli berhak mengajukan komplain garansi atau retur. Uang penampungan di Escrow akan segera dibubarkan kembali seutuhnya ke wallet Anda.</p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-inner">
                    <h4 className="font-extrabold text-xs sm:text-sm text-gray-900">Siapa saja yang bisa membuka dagangan di Ceksek?</h4>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed mt-2 font-normal">Demi menjaga sirkulasi ekosistem yang terjamin bersih, hanya mahasiswa aktif Universitas Negeri Semarang (UNNES) yang lolos verifikasi NIM dan SIKADU UNNES saja yang diizinkan untuk mengiklankan barang bekasnya.</p>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : selectedProduct ? (
            <motion.div
              key="detail-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-10"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="inline-flex items-center gap-2 text-[#00288e] hover:text-blue-800 font-bold text-sm mb-6 pb-2 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Kembali ke Beranda
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Product Images Showcase */}
                <div className="flex flex-col gap-4">
                  <div className="aspect-[4/3] w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 relative shadow-sm">
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.title} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-[#855300] text-white font-bold text-xs px-3 py-1.5 rounded-lg border border-yellow-400 shadow-md flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      Garansi Ceksek 7 Hari
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border-2 border-[#00288e] cursor-pointer">
                      <img src={selectedProduct.image} alt="Thumbnail 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 cursor-not-allowed opacity-55">
                      <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=400" alt="Alternate detail material view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 cursor-not-allowed opacity-55">
                      <img src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400" alt="Alternative detail lifestyle view" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>

                {/* Product Information details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="inline-block bg-[#eff4ff] text-[#00288e] font-bold text-xs px-3 py-1 rounded-full mb-3 border border-blue-100">
                      {selectedProduct.category}
                    </span>
                    <h1 className="text-3xl font-extrabold text-[#0b1c30] tracking-tight mb-2">
                      {selectedProduct.title}
                    </h1>

                    <div className="text-3xl font-black text-[#00288e] mb-6">
                      Rp {selectedProduct.price.toLocaleString('id-ID')}
                    </div>

                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-white shadow-inner">
                          <img 
                            src={selectedProduct.sellerImage} 
                            alt={selectedProduct.seller} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0b1c30] flex items-center gap-1.5">
                            {selectedProduct.seller}
                            <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                          </div>
                          <div className="text-xs text-gray-500">Grup Mahasiswa Terverifikasi</div>
                        </div>
                      </div>
                      <span className="bg-emerald-55 text-emerald-700 border border-emerald-150 font-bold text-xs px-2.5 py-1 rounded-lg flex items-center gap-1 bg-emerald-50">
                        <Check className="w-3.5 h-3.5" /> Est. Student
                      </span>
                    </div>

                    <div className="mb-6">
                      <h3 className="font-bold text-[#0b1c30] mb-2 text-sm uppercase tracking-wider">Deskripsi Barang</h3>
                      <p className="text-gray-650 leading-relaxed text-sm bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                        {selectedProduct.description}
                      </p>
                    </div>

                    <div className="bg-[#eff4ff] border border-blue-250 p-4 rounded-2xl flex items-start gap-3 bg-blue-50/70 border-blue-100">
                      <Shield className="w-5 h-5 text-[#00288e] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-xs text-[#00288e] mb-0.5 border-b border-blue-100 pb-1">Ceksek Proteksi Escrow</div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Uang Anda aman bersama rekening pihak ketiga Ceksek. Batas Garansi 7 Hari memastikan barang halal berkualitas sebelum dana dilepas ke penjual saat meetup area UNNES.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                    <button 
                      onClick={() => {
                        // Simulate purchase action on Card 2, redirects user to transaction view
                        setSelectedProduct(null);
                        setActiveTab('transactions');
                        setTransactionStep(3);
                        triggerToast('Demo Pembelian sedang berjalan untuk monitor 24 inci!');
                      }}
                      className="flex-grow py-4 bg-[#00288e] text-white hover:bg-blue-800 transition-colors rounded-xl font-bold text-sm shadow-md active:scale-95 duration-100"
                    >
                      Beli Sekarang (Escrow)
                    </button>
                    <button 
                      onClick={() => triggerToast(`Berhasil menambahkan ${selectedProduct.title} ke keranjang belanja.`)}
                      className="py-4 px-6 md:px-8 border border-[#00288e] text-[#00288e] hover:bg-[#eff4ff] transition-all rounded-xl font-bold text-sm"
                    >
                      Tambahkan Keranjang
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : activeTab === 'home' ? (
            
            /* HOME PAGE VIEW */
            <motion.div
              key="home-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="space-y-12"
            >
              {/* Home Sub-Tab Toggle Navigation Pills (Hidden: landing page is home now) */}
              <div className="hidden flex justify-center" id="home-subtab-navigation-toggle">
                <div className="bg-gray-100 p-1 rounded-2xl flex items-center gap-1 border border-gray-200/60 shadow-sm">
                  <button
                    onClick={() => { setHomeSubTab('landing'); setSelectedProduct(null); }}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                      homeSubTab === 'landing'
                        ? 'bg-[#00288e] text-white shadow-md'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <Shield className="w-4 h-4 shrink-0" />
                    Garansi Keamanan (Landing)
                  </button>
                  <button
                    onClick={() => { setHomeSubTab('catalog'); setSelectedProduct(null); }}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 ${
                      homeSubTab === 'catalog'
                        ? 'bg-[#00288e] text-white shadow-md'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    Katalog Barang Bekas ({productsList.length})
                  </button>
                </div>
              </div>

              {false ? (
                /* GORGEOUS LANDING PAGE SECTION */
                <div className="space-y-16" id="ceksek-landing-page-root">
                  
                  {/* Hero Head Banner */}
                  <div className="bg-gradient-to-br from-[#eff4ff] via-white to-blue-50/40 border border-blue-100/50 rounded-3xl p-8 md:p-14 relative overflow-hidden flex flex-col lg:flex-row justify-between items-center gap-12">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-amber-200/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="z-10 space-y-6 max-w-2xl text-left">
                      <span className="inline-flex items-center gap-1.5 bg-blue-100 text-[#00288e] font-bold text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-blue-200/50">
                        <Shield className="w-3.5 h-3.5 fill-blue-200" />
                        Platform Resmi Mahasiswa UNNES
                      </span>
                      
                      <h1 className="text-4xl sm:text-5xl font-black text-[#0b1c30] tracking-tight leading-tight">
                        Beli Barang Bekas Kampus, <span className="text-[#00288e] relative bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Bebas dari Penipuan.</span>
                      </h1>
                      
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        Ceksek menggunakan <strong className="text-gray-900 font-semibold">Rekening Escrow (Rekber)</strong> untuk menampung dana transaksimu. Uang hanya dicairkan ke penjual setelah kamu bertemu langsung di sekitar UNNES dan memeriksa kecocokan kondisi barang secara puas.
                      </p>

                      <div className="flex flex-wrap gap-4 pt-2">
                        <button 
                          onClick={() => setHomeSubTab('catalog')}
                          className="px-6 py-3.5 bg-[#00288e] text-white hover:bg-blue-850 transition-all rounded-xl font-bold text-sm shadow-lg shadow-blue-900/10 flex items-center gap-2 group active:scale-95 duration-150"
                        >
                          Mulai Belanja Sekarang
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => {
                            const elem = document.getElementById('escrow-how-it-works');
                            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                            else triggerToast("Scroll ke bagian cara kerja di bawah!");
                          }}
                          className="px-6 py-3.5 border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 transition-all rounded-xl font-bold text-sm"
                        >
                          Pelajari Cara Kerja
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-6 pt-6 border-t border-gray-100/60 max-w-md">
                        <div>
                          <div className="text-xl font-extrabold text-gray-900">0%</div>
                          <div className="text-[10px] text-gray-400 font-medium">Laporan Scam</div>
                        </div>
                        <div>
                          <div className="text-xl font-extrabold text-[#00288e]">5,000+</div>
                          <div className="text-[10px] text-gray-400 font-medium">Mahasiswa UNNES</div>
                        </div>
                        <div>
                          <div className="text-xl font-extrabold text-amber-500">7 Hari</div>
                          <div className="text-[10px] text-gray-400 font-medium">Garansi Retur</div>
                        </div>
                      </div>
                    </div>

                    {/* Right Hero Image Card Layout */}
                    <div className="shrink-0 w-full lg:w-[420px] aspect-video lg:aspect-square bg-white rounded-3xl overflow-hidden border border-gray-150/60 shadow-xl relative group">
                      <img 
                        src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200" 
                        alt="Unnes college students studying looking happy" 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#00288e] flex items-center gap-1.5 shadow-md border border-gray-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                        SIAKAD Verified
                      </div>
                      
                      <div className="absolute bottom-4 left-4 right-4 bg-[#0b1c30]/90 backdrop-blur-md p-5 rounded-2xl text-white text-left shadow-lg">
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                          <div className="font-bold text-xs text-amber-400">Escrow Aman Aktif</div>
                        </div>
                        <p className="text-[10px] text-gray-300 leading-relaxed font-normal">
                          Setiap rupiah dana belanja Anda dilindungi rekening bersama Ceksek. Penjual tidak akan menerima dana sebelum Anda mengonfirmasi kondisi fisik barang saat COD.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Kampus Trust Badges Section */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-around gap-6 text-center md:text-left">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 bg-blue-50 text-[#00288e] rounded-xl flex items-center justify-center border border-blue-100/50">
                        <UserCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">Verifikasi SIM-SIAKAD</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Semua penjual wajib masuk menggunakan NIM SIM UNNES aktif.</p>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-gray-100 hidden md:block" />
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100">
                        <History className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">Proteksi Garansi 7 Hari</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Waktu tambahan satu pekan untuk menguji barang secara menyeluruh.</p>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-gray-100 hidden md:block" />
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center border border-emerald-100">
                        <Coins className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-gray-900">Bebas Potongan / 100% Free</h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">Khusus mahasiswa UNNES, zero biaya administrasi escrow.</p>
                      </div>
                    </div>
                  </div>

                  {/* INTERACTIVE ESCROW SIMULATION PLAYGROUND */}
                  <section className="space-y-6" id="escrow-simulation-playground">
                    <div className="text-center space-y-2">
                      <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Simulasi Interaktif</span>
                      <h2 className="text-3xl font-extrabold text-gray-900">Cakap-Cakap: Bandingkan Cara Kerjanya</h2>
                      <p className="text-gray-505 text-sm max-w-xl mx-auto">Klik opsi transaksi untuk melihat simulasi perbedaan jika terjadi penipuan di marketplace biasa versus bertani aman di Ceksek Escrow.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
                      {/* Control Panel Simulator */}
                      <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-black text-base text-gray-900">Metode Jual Beli Bekas</h4>
                          <p className="text-xs text-gray-500 leading-normal">Pilih salah satu metode di bawah untuk menyaksikan demonstrasi langkah transaksi dan keamanannya secara real-time:</p>
                          
                          <div className="space-y-3 pt-2">
                            {/* Option 1: Traditional Transfer */}
                            <button
                              onClick={() => { setSimMode('traditional'); triggerToast("Beralih ke Simulasi Pasar Tradisional (Rentan)"); }}
                              className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                                simMode === 'traditional'
                                  ? 'border-[#ba1a1a] bg-red-50/20 text-[#ba1a1a] shadow-sm'
                                  : 'border-gray-100 hover:border-gray-250 bg-gray-50/50'
                              }`}
                            >
                              <div className={`p-2 rounded-xl border shrink-0 ${simMode === 'traditional' ? 'bg-[#ba1a1a]/10 border-[#ba1a1a]/20' : 'bg-white border-gray-200'}`}>
                                <X className={`w-5 h-5 ${simMode === 'traditional' ? 'text-[#ba1a1a]' : 'text-gray-400'}`} />
                              </div>
                              <div>
                                <div className="font-extrabold text-xs tracking-wide uppercase">Transfer Langsung Instan</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-normal">Membayar langsung ke penjual di luar platform sebelum bertemu ataupun memegang barang.</div>
                              </div>
                            </button>

                            {/* Option 2: Ceksek Escrow */}
                            <button
                              onClick={() => { setSimMode('ceksek'); triggerToast("Beralih ke Simulasi Keamanan Ceksek Escrow"); }}
                              className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                                simMode === 'ceksek'
                                  ? 'border-emerald-600 bg-emerald-50/20 text-emerald-800 shadow-sm'
                                  : 'border-gray-100 hover:border-gray-250 bg-gray-50/50'
                              }`}
                            >
                              <div className={`p-2 rounded-xl border shrink-0 ${simMode === 'ceksek' ? 'bg-emerald-600/10 border-emerald-600/20' : 'bg-white border-gray-200'}`}>
                                <Check className={`w-5 h-5 ${simMode === 'ceksek' ? 'text-emerald-600' : 'text-gray-400'}`} />
                              </div>
                              <div>
                                <div className="font-extrabold text-xs tracking-wide uppercase">Ceksek Rekber Escrow</div>
                                <div className="text-[11px] text-gray-500 mt-1 leading-normal">Uang ditahan aman di sistem Ceksek. Pembeli berhak tes produk 7 hari sebelum pencairan dana disetujui.</div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Interactive Warning banner */}
                        <div className={`p-4 rounded-2xl text-xs flex items-start gap-3 ${simMode === 'traditional' ? 'bg-red-50 text-[#ba1a1a] border border-red-100' : 'bg-emerald-50 text-emerald-850 border border-emerald-100'}`}>
                          <AlertTriangle className="w-5 h-5 shrink-0" />
                          <p className="leading-relaxed font-medium">
                            {simMode === 'traditional' 
                              ? "Peringatan: 87% penipuan kasus cod mahasiswa diakibatkan oleh transfer uang DP palsu terlebih dahulu sebelum janjian bertemu." 
                              : "Keberhasilan: Rekening bersama Ceksek menghabisi seluruh peluang penipuan karena penjual nakal tidak akan bisa mengambil dana sebelum lolos verifikasi fisik."}
                          </p>
                        </div>
                      </div>

                      {/* Simulator Steps Presentation Display */}
                      <div className="lg:col-span-7 bg-[#0b1c30] text-gray-100 rounded-3xl p-8 shadow-lg relative border border-blue-900/30 overflow-hidden flex flex-col justify-between">
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="space-y-6 relative z-10">
                          <div className="flex justify-between items-center pb-4 border-b border-gray-800">
                            <span className="font-black text-xs uppercase text-blue-400 tracking-widest">Alur Simulasi Pembelian</span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${simMode === 'traditional' ? 'bg-[#ba1a1a]/20 text-[#ffb4ab]' : 'bg-emerald-500/20 text-[#b4f0b2]'}`}>
                              {simMode === 'traditional' ? 'Keamanan Rendah (High-risk)' : 'Proteksi Maksimal (Waterproof)'}
                            </span>
                          </div>

                          {simMode === 'traditional' ? (
                            /* TRADITIONAL STEPS */
                            <div className="space-y-6">
                              <div className="flex gap-4 items-start relative pb-6 border-l-2 border-red-500/25 ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-xs font-black shadow-md shadow-[#ba1a1a]/30">1</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-white">Pembeli Tertarik Barang Bekas</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed mt-1">Bertemu dengan iklan penjual gadungan di grup sosmed kampus (FB / Telegram tanpa autentikasi).</p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start relative pb-6 border-l-2 border-red-500/25 ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-xs font-black shadow-md shadow-[#ba1a1a]/30">2</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-rose-300">Penjual Minta Transfer DP Terlebih Dahulu</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed mt-1">Penjual beralasan &apos;banyak yang antre pesan, tolong transfer DP Rp 100 ribu biar barang disimpan aman&apos;.</p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start relative pb-6 border-l-2 border-red-500/25 ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center text-xs font-black shadow-md shadow-[#ba1a1a]/30">3</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-rose-300">Dana Terkirim Langsung</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed mt-1">Pembeli mentransfer via M-Banking langsung menuju rekening pribadi penipu.</p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start relative ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-black shadow-md animate-pulse">❌</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-red-400">Penipu Memblokir Pembeli (Scam!)</h5>
                                  <p className="text-xs text-gray-300 leading-relaxed mt-1 font-semibold">Nomor WA diblokir, akun dihapus. Uang Rp 100k - Rp 1jt lenyap seketika, tiada jaminan ganti rugi.</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* CEKSEK ESCROW STEPS */
                            <div className="space-y-6">
                              <div className="flex gap-4 items-start relative pb-6 border-l-2 border-emerald-500/25 ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-md">1</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-white">Pembeli Mengunci Dana di Escrow</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed mt-1">Pembeli melakukan pembayaran resmi via Ceksek Wallet. Dana Anda aman terkunci di sistem Ceksek.</p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start relative pb-6 border-l-2 border-emerald-500/25 ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-md">2</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-white">Meetup COD Area Kampus UNNES</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed mt-1">Bertemu di wilayah terpilih (seperti Perpustakaan atau Rektorat). Penjual wajib menunjukkan barang, pembeli mengujinya ditempat.</p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start relative pb-6 border-l-2 border-emerald-500/25 ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-md">3</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-white">Masa Garansi Uji Coba 7 Hari</h5>
                                  <p className="text-xs text-gray-400 leading-relaxed mt-1">Bawa pulang barang tersebut, pakai untuk kuliah. Jika ditemukan kendala tersembunyi, klik tombol &apos;Ajukan Komplain&apos; untuk menolak pelepasan dana.</p>
                                </div>
                              </div>

                              <div className="flex gap-4 items-start relative ml-3 pl-6">
                                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md">✓</div>
                                <div>
                                  <h5 className="font-extrabold text-sm text-emerald-400">Pencairan Sukses / Uang Kembali</h5>
                                  <p className="text-xs text-gray-300 leading-relaxed mt-1 font-semibold">Bila produk normal maka dana dicairkan ke penjual. Bila rusak? Uang Anda kami transfer retur utuh kembali 100% tanpa potongan!</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-800 text-center flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
                          <span>Butuh Simulasi khusus kasus garansi?</span>
                          <button 
                            onClick={() => { setHomeSubTab('catalog'); triggerToast("Beralih ke Katalog. Silakan pilih salah satu produk untuk detail simulasi."); }}
                            className="text-[#fea619] hover:underline font-extrabold"
                          >
                            Coba Beli Barang Demo &rarr;
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* HOW IT WORKS PROCESS WORKFLOW TIMELINE */}
                  <section className="space-y-8 pt-4" id="escrow-how-it-works">
                    <div className="text-center space-y-2">
                      <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Langkah Bertransaksi</span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">5 Langkah Praktis Berdagang Ceksek</h2>
                      <p className="text-gray-505 text-sm max-w-lg mx-auto">Sangat ringkas dan mudah dipahami oleh seller maupun buyer di lingkungan kampus.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                      {/* Workflow Step 1 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                        <div className="w-10 h-10 bg-blue-50 text-[#00288e] font-black rounded-2xl flex items-center justify-center mb-4 text-xs">
                          01
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1.5">Pilih Kebutuhan</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Cari buku perkuliahan, monitor eksternal, laptop, perabot kos mahasiswa UNNES di katalog.</p>
                      </div>

                      {/* Workflow Step 2 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 font-black rounded-2xl flex items-center justify-center mb-4 text-xs">
                          02
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1.5">Kunci Uang</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Selesaikan pembayaran via transfer Escrow Ceksek Aman. Dana tersimpan erat.</p>
                      </div>

                      {/* Workflow Step 3 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                        <div className="w-10 h-10 bg-purple-50 text-purple-600 font-black rounded-2xl flex items-center justify-center mb-4 text-xs">
                          03
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1.5">COD & Cek</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Lakukan janjian bertemu di area aman lingkungan UNNES, cek kondisi barang dengan teliti.</p>
                      </div>

                      {/* Workflow Step 4 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                        <div className="w-10 h-10 bg-rose-50 text-rose-600 font-black rounded-2xl flex items-center justify-center mb-4 text-xs">
                          04
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1.5">Masa Tes 7 Hari</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Pakai barangnya di kos selama seminggu penuh. Kamu aman dari kerusakan tersembunyi.</p>
                      </div>

                      {/* Workflow Step 5 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm relative group hover:border-[#00288e]/40 transition-colors">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-750 font-black rounded-2xl flex items-center justify-center mb-4 text-xs">
                          05
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 mb-1.5">Dana Cair</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-normal">Klik cairkan di menu Transaksi untuk melepas dana belanja ke seller terpercaya.</p>
                      </div>
                    </div>
                  </section>

                  {/* HIGH FIDELITY TESTIMONIALS SECTION */}
                  <section className="space-y-8 pt-4">
                    <div className="text-center space-y-2">
                      <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Testimoni Mahasiswa</span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Kata Mahasiswa UNNES Berlangganan</h2>
                      <p className="text-gray-505 text-sm max-w-lg mx-auto">Kami mengumpulkan cerita asli dari teman-teman kampus yang sudah mencicipi sistem proteksi Ceksek.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Testimonial 1 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-normal">
                            &ldquo;Beli laptop bekas buat ngerjain skripsi kemarin ngeri banget kalau ditransfer langsung. Lewat Ceksek Escrow, uang ketahan dulu di rekber. Pas meetup di depan Fakultas Ekonomi, sepuasnya saya cek layar LCD dan batrenya. Rekomen banget!&rdquo;
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-6 border-t border-gray-50 mt-6">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shrink-0">
                            <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Farhan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h5 className="font-extrabold text-xs text-gray-950">Farhan Setiawan</h5>
                            <span className="text-[9px] text-gray-400 font-medium">Ekonomi Pembangunan UNNES</span>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 2 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-normal">
                            &ldquo;Jual monitor kemarin ga ribet lagi dituduh nipu ato barang rusak. Pembeli juga seneng dapet jaminan masa pelindung 7 hari dari Ceksek. Begitu masanya lewat langsung cair ke rekening saldo saya. Aman dan transparan.&rdquo;
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-6 border-t border-gray-50 mt-6">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shrink-0">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Sarah" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h5 className="font-extrabold text-xs text-gray-950">Sarah Amanda</h5>
                            <span className="text-[9px] text-gray-400 font-medium">Teknik Informatika UNNES</span>
                          </div>
                        </div>
                      </div>

                      {/* Testimonial 3 */}
                      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex gap-1 text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-normal">
                            &ldquo;Buat anak kos yang uang bulanan ngepres, beli buku kalkulus &amp; programming bekas jadi andalan. Suka was-was kalo bukunya ternyata lecek parah atau kelipet parah. Di Ceksek dapet seller satu kosan dan ada jaminan retur. Juara!&rdquo;
                          </p>
                        </div>
                        <div className="flex items-center gap-3 pt-6 border-t border-gray-50 mt-6">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-150 shrink-0">
                            <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" alt="Irfan" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <h5 className="font-extrabold text-xs text-gray-950">Irfan Hakim</h5>
                            <span className="text-[9px] text-gray-400 font-medium">Pendidikan Biologi UNNES</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Keren Landing CTA Banner Footer */}
                  <div className="bg-[#00288e] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-lg">
                    <div className="absolute top-0 right-0 -mr-16 -mt-16 w-52 h-52 bg-white/5 rounded-full pointer-events-none" />
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-400/15 rounded-full pointer-events-none animate-pulse" />
                    
                    <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">Yakin Masih Mau Ambil Risiko Jual Beli via Transfer Biasa?</h3>
                      <p className="text-blue-105 text-xs sm:text-sm leading-relaxed opacity-90 max-w-lg mx-auto">
                        Jangan biarkan beasiswa atau kiriman bulanan orang tua melayang sia-sia ke tangan penipu. Daftarkan dan lakukan transaksi aman pertamamu hari ini juga!
                      </p>
                      
                      <button 
                        onClick={() => { setHomeSubTab('catalog'); triggerToast("Beralih ke Katalog. Selamat menjelajah barang!"); }}
                        className="px-8 py-4 bg-amber-400 hover:bg-amber-450 transition-all text-[#001453] rounded-2xl font-black text-sm shadow-md active:scale-95 duration-150 tracking-wider inline-flex items-center gap-2"
                      >
                        Jelajahi Produk Yang Tersedia Sekarang
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* FAQ ACCORDION SECTION */}
                  <section className="space-y-6 pt-4 max-w-3xl mx-auto">
                    <div className="text-center space-y-1">
                      <span className="text-xs font-black text-[#00288e] uppercase tracking-wider">Tanya Jawab</span>
                      <h3 className="text-xl font-extrabold text-gray-900">Pertanyaan Umum Ceksek Escrow</h3>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-inner">
                        <h4 className="font-extrabold text-sm text-gray-900">Apakah Ceksek menahan uang selamanya?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mt-2">Tidak. Uang belanja pembeli tersimpan rapi sampai pembeli melakukan klik &apos;Pesanan Selesai&apos; atau batas waktu otomatis garansi 7 hari telah habis, barulah dana diteruskan menuju saldo wallet milik penjual.</p>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-inner">
                        <h4 className="font-extrabold text-sm text-gray-900">Apa yang terjadi jika barang tidak sesuai saat COD?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mt-2">Jika saat bertemu kondisi fisiknya jauh berbeda dengan deskripsi, pembeli berhak membatalkan pembelian. Uang penampungan di Escrow akan segera dikembalikan seutuhnya ke saldo akun pembeli tanpa potongan satu rupiah pun.</p>
                      </div>

                      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-inner">
                        <h4 className="font-extrabold text-sm text-gray-900">Siapa saja yang bisa membuka dagangan di Ceksek?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed mt-2">Demi menjaga sirkulasi ekosistem yang terik, hanya mahasiswa aktif Universitas Negeri Semarang (UNNES) yang lolos verifikasi biodata kemahasiswaan saja yang diizinkan untuk mengiklankan barang bekas dagangannya.</p>
                      </div>
                    </div>
                  </section>

                </div>
              ) : (
                /* ORIGINAL ACTIVE CATALOG GRID SECTION IN HIGH QUALITY DESIGN */
                <div className="space-y-8" id="catalog-section-container">
                  {/* Category selector Pills tabs */}
                  <div className="space-y-4">
                    <div id="category-tabs-container" className="flex flex-wrap items-center gap-2 border-b border-gray-100 pb-4">
                      {['Semua Kategori', 'Buku Kuliah', 'Elektronik (Laptop/HP)', 'Perabotan Kos'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            triggerToast(`Menyaring berdasarkan kategori: ${cat}`);
                          }}
                          className={`px-5 py-2.5 rounded-full font-bold text-xs tracking-wide transition-all border ${
                            selectedCategory === cat 
                              ? 'bg-[#00288e] text-white border-[#00288e] shadow-md shadow-blue-200' 
                              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-450 hover:bg-gray-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}

                      {/* Add sell items direct utility button */}
                      <button 
                        onClick={() => setShowSellModal(true)}
                        className="ml-auto flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-250 px-4 py-2 rounded-full font-bold text-xs transition-colors shrink-0 whitespace-nowrap bg-emerald-50 border-emerald-200"
                      >
                        <Plus className="w-4 h-4" />
                        Buka Dagangan Baru
                      </button>
                    </div>
                  </div>

                  {/* Filter Search results title row */}
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-black text-gray-950 tracking-tight">
                          Daftar Kebutuhan Kampus Aktif
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">Menyediakan barang bekas asli dari sesama mahasiswa Universitas Negeri Semarang terverifikasi.</p>
                      </div>
                      <span className="text-xs text-gray-400 font-extrabold bg-gray-50 border border-gray-150 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-sm">
                        Total: {filteredProducts.length} Produk Sesuai
                      </span>
                    </div>

                    {/* Integrated Search Input right inside Katalog */}
                    <div className="relative w-full max-w-xl">
                      <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                        <Search className="w-5 h-5 text-gray-450" />
                      </span>
                      <input 
                        type="text"
                        placeholder="Masukkan buku kuliah, monitor IPS, perabotan kos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-xs pl-12 pr-28 py-3.5 bg-white border border-gray-200 rounded-xl shadow-inner focus:outline-none focus:ring-1 focus:ring-[#00288e] focus:bg-white text-gray-800 font-medium"
                      />
                      <button 
                        onClick={() => triggerToast(`Saringan pencarian untuk "${searchQuery || 'semua item'}" aktif.`)}
                        className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#00288e] text-white hover:bg-blue-800 transition-colors px-4 rounded-lg font-bold text-xs"
                      >
                        Cari
                      </button>
                    </div>

                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-24 bg-white border border-gray-100 rounded-3xl space-y-4">
                        <SlidersHorizontal className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="text-gray-500 text-sm">Tidak ditemukan barang bekas yang sesuai dengan kata kunci Anda.</p>
                        <button 
                          onClick={() => { setSearchQuery(''); setSelectedCategory('Semua Kategori'); }}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-xs transition-colors"
                        >
                          Reset Filter Pencarian
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProducts.map((prod) => (
                          <motion.div
                            key={prod.id}
                            layout
                            onClick={() => setSelectedProduct(prod)}
                            className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1"
                          >
                            {/* Product Card Upper visual with protected badge */}
                            <div className="aspect-[4/3] w-full bg-gray-50 overflow-hidden relative">
                              <img 
                                src={prod.image} 
                                alt={prod.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-3 left-3 bg-[#855300] text-white font-bold text-[10px] px-2.5 py-1 rounded-lg border border-yellow-400 shadow-sm flex items-center gap-1 bg-amber-600">
                                <Shield className="w-3 h-3" />
                                Garansi Ceksek 7 Hari
                              </div>
                              
                              <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-0.5 rounded-md text-[10px] font-semibold text-gray-505 border border-gray-100 text-slate-700">
                                Kampus UNNES
                              </div>
                            </div>

                            {/* Card Body text metadata details */}
                            <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                              <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#00288e] block mb-1">
                                  {prod.category}
                                </span>
                                <h3 className="font-bold text-gray-900 group-hover:text-[#00288e] transition-colors leading-snug line-clamp-1">
                                  {prod.title}
                                </h3>
                                <div className="text-lg font-black text-[#00288e] mt-1.5">
                                  Rp {prod.price.toLocaleString('id-ID')}
                                </div>
                              </div>

                              {/* Verified student seller block info */}
                              <div className="pt-3 border-t border-gray-55 flex items-center justify-between border-gray-50">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full overflow-hidden shadow-inner border border-gray-100 shrink-0">
                                    <img 
                                      src={prod.sellerImage} 
                                      alt={prod.seller} 
                                      className="w-full h-full object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                  <span className="font-semibold text-xs text-gray-650 min-w-0 truncate max-w-[110px]">
                                    {prod.seller}
                                  </span>
                                </div>

                                <span className="bg-emerald-50 text-emerald-750 border border-emerald-150 font-bold text-[9px] px-2 py-0.5 rounded-md flex items-center gap-0.5 bg-emerald-50 border-emerald-100">
                                  <CheckCircle2 className="w-2.5 h-2.5 fill-emerald-500 text-white shrink-0" />
                                  Verified NIM
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          ) : activeTab === 'transactions' ? (
            
            /* TRANSACTIONS PAGE VIEW */
            <motion.div
              key="transactions-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="space-y-8"
            >
              {/* Header Title Section */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div>
                  <h1 className="text-3xl font-black text-[#0b1c30] tracking-tight">
                    Transaksi Aktif
                  </h1>
                  <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
                    Kode Escrow Proteksi: <span className="font-mono bg-gray-105 px-2 py-1 rounded text-xs font-bold text-blue-900 bg-gray-100">#CS-98241</span>
                  </p>
                </div>
                <div className="bg-amber-50 text-[#855300] border border-amber-200. border-amber-200 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 self-start">
                  <Shield className="w-4 h-4 animate-bounce" /> Escrow Ceksek Sedang Mengunci Dana
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left side items and flow steps */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Detailed Product Row Item Description */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600" 
                          alt="Used Monitor 24 inch thumbnail" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#00288e] bg-[#eff4ff] border border-blue-50 px-2 py-0.5 rounded mb-1.5 inline-block">
                          Elektronik (Laptop/HP)
                        </span>
                        <h3 className="font-extrabold text-lg text-gray-900 leading-tight">
                          Used Monitor 24&quot;
                        </h3>
                        <p className="font-black text-lg text-[#00288e] mt-1">
                          Rp 650.000
                        </p>
                      </div>
                    </div>

                    <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-1.5 bg-gray-50 p-2 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
                          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" alt="Siti Aminah" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <div className="font-bold text-xs flex items-center gap-1">
                            Siti Aminah <Check className="w-3 h-3 text-emerald-500 font-extrabold" />
                          </div>
                          <div className="text-[9px] text-gray-400">Teknik Informatika</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal visual stepper tracker */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
                    <h3 className="font-bold text-[#0b1c30] text-sm uppercase tracking-wider">Metode Langkah Transaksi</h3>
                    
                    <div className="relative pt-4 pb-8">
                      {/* Connecting line */}
                      <div className="absolute top-9 left-6 right-6 h-1 bg-gray-100 -translate-y-1/2 rounded" />
                      <div 
                        className="absolute top-9 left-6 h-1 bg-emerald-500 -translate-y-1/2 rounded transition-all duration-500" 
                        style={{ width: transactionStep === 3 ? '66%' : transactionStep === 4 ? '100%' : '33%' }}
                      />

                      <div className="relative flex justify-between items-center">
                        
                        {/* Step 1 */}
                        <div className="flex flex-col items-center space-y-2 z-10">
                          <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow border-4 border-white">
                            <Check className="w-5 h-5 font-black" />
                          </div>
                          <span className="text-xs font-bold text-[#0b1c30]">Dana Diamankan</span>
                          <span className="text-[10px] text-gray-400 font-medium">Lunas Escrow</span>
                        </div>

                        {/* Step 2 */}
                        <div className="flex flex-col items-center space-y-2 z-10">
                          <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow border-4 border-white">
                            <Check className="w-5 h-5 font-black" />
                          </div>
                          <span className="text-xs font-bold text-[#0b1c30]">Meetup &amp; Cek Fisik</span>
                          <span className="text-[10px] text-gray-400 font-medium">Selesai di Kampus</span>
                        </div>

                        {/* Step 3 */}
                        <div className="flex flex-col items-center space-y-2 z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow border-4 border-white transition-all ${
                            transactionStep >= 3 
                              ? 'bg-blue-600 text-white animate-pulse' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            {transactionStep > 3 ? <Check className="w-5 h-5 font-black" /> : <Shield className="w-5 h-5" />}
                          </div>
                          <span className={`text-xs font-bold ${transactionStep === 3 ? 'text-blue-600' : 'text-[#0b1c30]'}`}>
                            Garansi 7 Hari Berjalan
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">Batas Retur Aktif</span>
                        </div>

                        {/* Step 4 */}
                        <div className="flex flex-col items-center space-y-2 z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow border-4 border-white transition-all ${
                            transactionStep === 4 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-gray-100 text-gray-400'
                          }`}>
                            <Check className="w-5 h-5 font-black" />
                          </div>
                          <span className={`text-xs font-bold ${transactionStep === 4 ? 'text-emerald-600' : 'text-gray-400'}`}>Selesai</span>
                          <span className="text-[10px] text-gray-450 text-slate-400">Dana Dicairkan</span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side escrow and actions columns */}
                <div className="space-y-6">
                  {/* Alert Countdown Warranty Box Component */}
                  <div className="bg-[#eff4ff] border border-blue-200 rounded-3xl p-6 shadow-sm flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#00288e] shadow-sm border border-blue-105">
                      <Shield className="w-6 h-6 fill-amber-300 stroke-[#00288e]" />
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-bold text-blue-900 uppercase tracking-widest">Sisa Waktu Garansi Ceksek</h3>
                      <div className="text-lg font-black text-blue-900 mt-2 font-mono bg-white px-4 py-2 rounded-xl shadow-inner border border-blue-100 inline-block">
                        {formattedCountdown}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed max-w-xs">
                      Uang Anda aman terkunci dalam sistem escrow Ceksek. Jika barang yang Anda terima rusak atau tidak sesuai deskripsi Siti Aminah, silakan klik tombol retur di bawah untuk membekukan pencairan.
                    </p>
                  </div>

                  {/* Actions Area */}
                  {transactionStep === 3 ? (
                    <div className="space-y-3">
                      <button
                        onClick={handleReleaseEscrow}
                        className="w-full bg-[#00288e] text-white hover:bg-blue-800 transition-colors py-4 rounded-2xl font-bold text-sm shadow-md flex items-center justify-center gap-2 duration-100 active:scale-98"
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        Pesanan Selesai (Cairkan Dana)
                      </button>
                      
                      <button
                        onClick={() => setShowComplainModal(true)}
                        className="w-full border border-[#ba1a1a] text-[#ba1a1a] hover:bg-red-50 transition-colors py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        Ajukan Komplain (Retur)
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-250 p-6 rounded-3xl text-center space-y-3 bg-emerald-50 border-emerald-200">
                      <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto fill-emerald-100" />
                      <div>
                        <h4 className="font-extrabold text-sm text-emerald-800">Transaksi Selesai</h4>
                        <p className="text-xs text-emerald-600 leading-relaxed mt-1">
                          Terima kasih atas kepercayaan Anda bertransaksi di Ceksek. Escrow dana telah sepenuhnya dicairkan menuju Siti Aminah secara selamat.
                        </p>
                      </div>
                      <button 
                        onClick={() => { setActiveTab('home'); setTransactionStep(3); }}
                        className="w-full mt-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors py-2 rounded-xl text-xs font-bold"
                      >
                        Lanjutkan Belanja
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            
            /* PROFILE PAGE VIEW */
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.15 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* User Header and Wallet Left Panel */}
                <div className="lg:col-span-4 space-y-6">
                  {/* User Card */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-center space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-50/50" />
                    
                    <div className="relative pt-6 flex justify-center">
                      <div className="w-24 h-24 rounded-full overflow-hidden shadow-md border-4 border-white bg-gray-50 scale-100 hover:scale-105 transition-transform duration-300">
                        <img 
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" 
                          alt="David Verstappen university student profile" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div>
                      <h2 className="text-2xl font-black text-[#0b1c30]">David Verstappen</h2>
                      <p className="text-gray-500 text-xs font-semibold mt-1">Teknik Informatika • Universitas Negeri Semarang</p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-4 py-1.5 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
                      Verified Student Address
                    </div>
                  </div>

                  {/* Ceksek Wallet Card */}
                  <div className="bg-[#00288e] text-white rounded-3xl p-6 shadow-lg shadow-blue-900/10 relative overflow-hidden">
                    {/* Abstract design vector circle shapes inside */}
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-24 h-24 bg-amber-400/10 rounded-full pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col justify-between h-full space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-5 h-5 text-amber-400" />
                          <span className="text-xs font-bold tracking-wider uppercase opacity-90">Saldo Ceksek</span>
                        </div>
                        <span className="bg-white/10 text-white border border-white/20 text-[10px] font-bold px-3 py-1 rounded-full">
                          Escrow Safe
                        </span>
                      </div>

                      <div className="text-4xl font-extrabold tracking-tight">
                        Rp {walletBalance.toLocaleString('id-ID')}
                      </div>

                      <button 
                        onClick={() => setShowWithdrawModal(true)}
                        className="w-full bg-[#fea619] text-[#001453] hover:bg-amber-450 hover:shadow-md transition-all py-3.5 rounded-xl font-extrabold text-xs tracking-wider"
                      >
                        Tarik Saldo Ke Rekening
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats row & Options list Right Panel */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Stats columns dashboard */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm flex flex-col items-center justify-center">
                      <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-[#fea619] mb-2 border border-amber-100">
                        <Star className="w-5 h-5 fill-amber-400 stroke-[#fea619]" />
                      </div>
                      <div className="text-lg font-black text-gray-900">4.9 Rating</div>
                      <span className="text-[10px] text-gray-400 font-medium mt-0.5">Berdasarkan ulasan</span>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm flex flex-col items-center justify-center" id="stat-sold-items">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#00288e] mb-2 border border-blue-105">
                        <Store className="w-5 h-5" />
                      </div>
                      <div className="text-lg font-black text-gray-900">12 Barang Terjual</div>
                      <span className="text-[10px] text-gray-400 font-medium mt-0.5">Riwayat niaga</span>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center shadow-sm flex flex-col items-center justify-center">
                      <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-2 border border-purple-100">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div className="text-lg font-black text-gray-900">5 Barang Dibeli</div>
                      <span className="text-[10px] text-gray-400 font-medium mt-0.5">Total pesanan</span>
                    </div>
                  </div>

                  {/* Clicking menus simulation lists */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm divide-y divide-gray-50 overflow-hidden">
                    {/* Item 1 */}
                    <div 
                      onClick={() => setShowJualanModal(true)}
                      className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 w-10 h-10 rounded-xl bg-orange-50 text-[#855300] flex items-center justify-center border border-orange-100">
                          <Store className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0b1c30]">Jualan Saya</div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Kelola iklan aktif dan atur deskripsi barang jualan kos.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-450 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Item 2 */}
                    <div 
                      onClick={() => setShowRiwayatModal(true)}
                      className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 w-10 h-10 rounded-xl bg-blue-50 text-[#00288e] flex items-center justify-center border border-blue-100">
                          <History className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0b1c30]">Riwayat Transaksi</div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Lihat berkas transaksi, retur dan bukti meetup escrow lampau.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-450 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Item 3 */}
                    <div 
                      onClick={() => setShowVerifikasiModal(true)}
                      className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                          <Building className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">
                            Verifikasi Kampus
                          </div>
                          <p className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md inline-block mt-1 border border-emerald-110">
                            david***@students.unnes.ac.id Active
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-450 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Item 4 */}
                    <div 
                      onClick={() => setShowBantuanModal(true)}
                      className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 w-10 h-10 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center border border-gray-100">
                          <HelpCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#0b1c30]">Pusat Bantuan Ceksek</div>
                          <p className="text-[10px] text-gray-400 mt-0.5">Panduan aman bertransaksi, klaim asuransi retur.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-450 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Item 5 - LogOut sign */}
                    <div 
                      onClick={() => triggerToast("Keluar sistem berhasil. Data login terhapus secara aman.")}
                      className="flex items-center justify-between p-5 hover:bg-red-50/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#ba1a1a]">Keluar</div>
                          <p className="text-[10px] text-red-450 text-red-500 mt-0.5">Hapus kredensial sesi saat ini.</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[#ba1a1a] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* MODALS DIALOG POPUPS */}
      
      {/* 1. Add Selling Listing Modal */}
      <AnimatePresence>
        {showSellModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSellModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 md:p-8 shadow-2xl border border-gray-100 z-10 relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-xl font-extrabold text-[#0b1c30]">Buka Iklan Barang Baru</h3>
                <button onClick={() => setShowSellModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-550 uppercase">Nama Barang / Judul Iklan *</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Lampu Tidur LED, Buku Fisika Dasar" 
                    required
                    value={newListing.title}
                    onChange={(e) => setNewListing(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00288e] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-550 uppercase">Kategori Barang *</label>
                    <select
                      value={newListing.category}
                      onChange={(e) => setNewListing(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00288e] focus:bg-white focus:outline-none transition-all"
                    >
                      <option value="Buku Kuliah">Buku Kuliah</option>
                      <option value="Elektronik (Laptop/HP)">Elektronik (Laptop/HP)</option>
                      <option value="Perabotan Kos">Perabotan Kos</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-550 uppercase">Harga Jual (Rupiah) *</label>
                    <input 
                      type="text" 
                      placeholder="Contoh: 150000" 
                      required
                      value={newListing.price}
                      onChange={(e) => setNewListing(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00288e] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-550 uppercase">Deskripsi detail barang / kelengkapan *</label>
                  <textarea 
                    placeholder="Sebutkan masa pakai, minus barang, kelengkapan kabel, atau kelebihan lainnya agar pembelinya mantap..." 
                    rows={4}
                    value={newListing.description}
                    onChange={(e) => setNewListing(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00288e] focus:bg-white focus:outline-none transition-all resize-none"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl border border-gray-200 shadow-sm text-gray-400">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-900">Upload Foto Barang</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">Sistem akan menyematkan placeholder gambar otomatis</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#00288e] bg-[#eff4ff] border border-blue-105 px-2.5 py-1 rounded-md">Auto Mock</span>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-grow py-3.5 bg-[#00288e] text-white hover:bg-blue-800 transition-colors rounded-xl font-bold text-sm shadow-md"
                  >
                    Iklankan Sekarang
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowSellModal(false)}
                    className="py-3.5 px-6 border border-gray-200 hover:bg-gray-100 transition-colors rounded-xl font-bold text-sm text-gray-650"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Withdraw Saldo Wallet Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowWithdrawModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 border border-gray-100 z-10 relative space-y-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <Coins className="text-amber-500 w-5 h-5" /> Tarik Saldo Wallet
                </h3>
                <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-[#eff4ff] border border-blue-50/70 p-4 rounded-xl text-center space-y-1">
                <span className="text-[10px] uppercase font-bold text-gray-450 text-[#00288e] tracking-wider">Maksimal Penarikan</span>
                <div className="text-2xl font-black text-[#00288e]">Rp {walletBalance.toLocaleString('id-ID')}</div>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Rekening Tujuan Penyaluran *</label>
                  <select 
                    value={withdrawBank}
                    onChange={(e) => setWithdrawBank(e.target.value)}
                    className="w-full text-xs p-3 bg-gray-50 border border-gray-150 rounded-xl focus:ring-1 focus:ring-blue-600 focus:outline-none focus:bg-white text-gray-700 font-medium"
                  >
                    <option value="UNNES Bank Mandiri - 134000305820">UNNES Bank Mandiri - 134000305820</option>
                    <option value="Ceksek Gopay / E-Wallet - 085814502094">Ceksek Gopay / E-Wallet - 085814502094</option>
                    <option value="Bank Central Asia (BCA) - 864205831">Bank Central Asia (BCA) - 864205831</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Nominal Dana Yang Ditarik (Rupiah) *</label>
                  <input 
                    type="number"
                    placeholder="Contoh: 150000"
                    required
                    max={walletBalance}
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full text-xs p-3 bg-gray-50 border border-gray-155 rounded-xl focus:ring-1 focus:ring-blue-600 focus:outline-none focus:bg-white text-gray-800 font-bold"
                  />
                  <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                    <span>Biaya admin transfer antarbank</span>
                    <span className="font-bold text-emerald-600">Gratis (Subsidi Ceksek)</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    type="submit"
                    className="flex-grow py-3 bg-[#00288e] text-white hover:bg-blue-800 transition-colors rounded-xl font-bold text-xs"
                  >
                    Setujui &amp; Tarik Dana
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowWithdrawModal(false)}
                    className="py-3 px-5 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors rounded-xl font-bold text-xs"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Escrow Complaint Retur Modal */}
      <AnimatePresence>
        {showComplainModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowComplainModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 border border-gray-100 z-10 relative space-y-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-extrabold text-[#ba1a1a] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 shrink-0" /> Ajukan Komplain Garansi
                </h3>
                <button onClick={() => setShowComplainModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-xs text-red-700 leading-normal">
                Dana sebesar <strong>Rp 650.000</strong> akan ditangguhkan pencairannya sampai staf penengah internal Ceksek memverifikasi argumen atau kesepakatan meetup retur ulang.
              </div>

              <form onSubmit={handleComplain} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-550 uppercase">Alasan detail mengapa barang tidak sesuai *</label>
                  <textarea 
                    placeholder="Sebutkan detail ketidaksesuaian barang dari deskripsi / cacat fisik yang baru disadari saat meetup..." 
                    rows={4}
                    required
                    value={complainText}
                    onChange={(e) => setComplainText(e.target.value)}
                    className="w-full text-xs p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-1 focus:ring-[#ba1a1a] focus:bg-white focus:outline-none transition-all resize-none text-gray-850"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button 
                    type="submit"
                    className="flex-grow py-3 bg-[#ba1a1a] text-white hover:bg-red-700 transition-colors rounded-xl font-bold text-xs"
                  >
                    Kirim Klaim Komplain
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowComplainModal(false)}
                    className="py-3 px-5 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors rounded-xl font-bold text-xs"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Jualan Saya Modal */}
      <AnimatePresence>
        {showJualanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowJualanModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 border border-gray-100 z-10 relative space-y-6 text-left max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <Store className="text-amber-500 w-5 h-5" /> Katalog Jualan Saya
                </h3>
                <button onClick={() => setShowJualanModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-gray-500 leading-normal">
                Kelola iklan aktif Anda yang terdaftar dengan nama penjual <strong className="text-[#00288e]">David/David Verstappen</strong> di platform Ceksek UNNES.
              </div>

              <div className="space-y-3">
                {productsList.filter(p => p.seller === 'David').length === 0 ? (
                  <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-semibold">Anda belum memiliki barang jualan aktif saat ini.</p>
                    <button 
                      onClick={() => { setShowJualanModal(false); setShowSellModal(true); }}
                      className="mt-3 px-4 py-2 bg-[#00288e] text-white rounded-xl text-xs font-black hover:bg-blue-800 transition-colors"
                    >
                      Buka Iklan Baru
                    </button>
                  </div>
                ) : (
                  productsList.filter(p => p.seller === 'David').map(product => (
                    <div key={product.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100 items-center justify-between">
                      <div className="flex gap-3 items-center">
                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white border border-gray-150">
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-[#00288e] bg-[#eff4ff] px-1.5 py-0.5 rounded uppercase">
                            {product.category}
                          </span>
                          <h4 className="font-extrabold text-xs text-gray-900 mt-1 line-clamp-1">{product.title}</h4>
                          <span className="text-xs font-black text-gray-700">Rp {product.price.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => {
                          setProductsList(prev => prev.filter(p => p.id !== product.id));
                          triggerToast(`Berhasil menghapus iklan jualan "${product.title}"`);
                        }}
                        className="text-[10px] font-black text-red-650 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-105 px-3 py-1.5 rounded-xl border border-red-100 transition-all shrink-0 active:scale-95"
                      >
                        Hapus Iklan
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setShowJualanModal(false)}
                  className="py-2.5 px-6 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-xl font-bold text-xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Riwayat Transaksi Modal */}
      <AnimatePresence>
        {showRiwayatModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowRiwayatModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 border border-gray-100 z-10 relative space-y-5 text-left max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <History className="text-blue-600 w-5 h-5" /> Riwayat Transaksi Anda
                </h3>
                <button onClick={() => setShowRiwayatModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Transaction 1 - Monitor (linked with transactionStep state) */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-gray-400">#CS-98241 • 4 Juni 2026</span>
                    {transactionStep === 3 ? (
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full animate-pulse">
                        Masa Garansi 7 Hari
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                        Transaksi Selesai
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-150">
                      <img src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=150" alt="Monitor IPS" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Used Monitor IPS 24&quot;</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Penjual: Siti Aminah</p>
                      <span className="text-xs font-black text-[#00288e] block mt-1">Rp 650.000</span>
                    </div>
                  </div>
                </div>

                {/* Transaction 2 */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-gray-400">#CS-96402 • 28 Mei 2026</span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Transaksi Selesai
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-150">
                      <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=150" alt="Kalkulus" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Buku Kalkulus Purchell Edisi 9</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Penjual: Budi Santoso</p>
                      <span className="text-xs font-black text-[#00288e] block mt-1">Rp 50.000</span>
                    </div>
                  </div>
                </div>

                {/* Transaction 3 */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[9px] text-gray-400">#CS-92811 • 15 Mei 2026</span>
                    <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      Transaksi Selesai
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white border border-gray-150">
                      <img src="https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=150" alt="Meja Lipat" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-gray-900">Meja Lipat Belajar Portabel</h4>
                      <p className="text-xs text-gray-400 mt-0.5">Penjual: Indah Kusuma</p>
                      <span className="text-xs font-black text-[#00288e] block mt-1">Rp 35.000</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setShowRiwayatModal(false)}
                  className="py-2.5 px-6 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-xl font-bold text-xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Verifikasi Kampus Modal */}
      <AnimatePresence>
        {showVerifikasiModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowVerifikasiModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-sm p-6 border border-gray-100 z-10 relative space-y-6 text-left"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <Building className="text-emerald-600 w-5 h-5" /> Digital Student Card
                </h3>
                <button onClick={() => setShowVerifikasiModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Verified Student KTM visual layout decoration card */}
              <div className="bg-gradient-to-br from-[#0c1d33] via-[#102a4a] to-[#1a3d66] text-white rounded-2xl p-5 shadow-lg border border-gray-800 relative overflow-hidden space-y-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full translate-x-4 -translate-y-4 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-x-10 translate-y-10 pointer-events-none" />
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-amber-400 tracking-widest uppercase font-mono">UNIVERSITAS NEGERI SEMARANG</span>
                    <h4 className="text-xs font-black text-white">STUDENT IDENTIFICATION</h4>
                  </div>
                  <span className="text-[9px] font-black tracking-tighter text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                    ACTIVE
                  </span>
                </div>

                <div className="flex gap-4 items-center relative z-10">
                  <div className="w-16 h-20 rounded-lg overflow-hidden border-2 border-white/20 shrink-0 bg-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200" 
                      alt="David Verstappen university student profile" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-1">
                    <h5 className="font-extrabold text-sm text-white tracking-wide">David Verstappen</h5>
                    <p className="font-mono text-[9px] text-gray-300">NIM: 24021110058</p>
                    <p className="text-[10px] text-gray-405 text-gray-300 font-semibold">Teknik Informatika (S1)</p>
                    <p className="text-[9px] text-amber-400 font-black">Verified Email Kampus: david***@students.unnes.ac.id</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-white/10 relative z-10">
                  <div className="text-[8px] text-gray-400 font-semibold font-mono">
                    VALID UNTIL: SEPT 2028
                  </div>
                  {/* Mock barcode strip or QR icon visual representation */}
                  <div className="flex gap-0.5 items-center bg-white p-1 rounded">
                    <span className="text-[8px] font-bold text-slate-900 uppercase">CEKSEK TRUSTED</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-center">
                <p className="text-xs font-semibold text-emerald-800 leading-normal">
                  Identitas Anda telah sah diverifikasi oleh sistem Single Sign-On (SSO) UNNES. Anda dapat menggunakan lencana verifikasi ini untuk meningkatkan rasa aman calon pembeli.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setShowVerifikasiModal(false)}
                  className="py-2.5 px-6 bg-[#00288e] text-white hover:bg-blue-800 transition-colors rounded-xl font-bold text-xs animate-none"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. Interactive Pusat Bantuan FAQ Modal */}
      <AnimatePresence>
        {showBantuanModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowBantuanModal(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-white rounded-3xl w-full max-w-lg p-6 border border-gray-100 z-10 relative space-y-5 text-left max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="text-lg font-extrabold text-[#0b1c30] flex items-center gap-2">
                  <HelpCircle className="text-blue-600 w-5 h-5" /> Pusat Bantuan Ceksek
                </h3>
                <button onClick={() => setShowBantuanModal(false)} className="text-gray-400 hover:text-black transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-gray-500 leading-relaxed">
                Punya pertanyaan seputar keamanan transaksi di lingkungan kampus UNNES Semesta? Temukan jawaban lengkap seputar sistem perlindungan escrow Ceksek di bawah ini.
              </p>

              {/* Dynamic Accordion list */}
              <div className="space-y-2">
                {[
                  {
                    q: "Bagaimana cara kerja Ceksek Escrow / Rekber?",
                    a: "Saat pembeli membayar barang bekas yang diinginkan, dana tidak langsung masuk ke dompet penjual, melainkan diamankan di sistem rekening escrow bersama Ceksek. Penjual dan pembeli melakukan janjian (meetup) di kampus UNNES untuk cek fisik barang. Setelah pembeli puas dan menyetujui pelepasan dana, barulah saldo dicairkan ke penjual. Selama meetup, dana Anda 100% aman terproteksi!"
                  },
                  {
                    q: "Bagaimana cara mengajukan Klaim Garansi 7 Hari (Retur)?",
                    a: "Jika barang yang Anda terima ternyata mengalami kerusakan tersembunyi setelah meetup, Anda memiliki waktu 7 hari masa garansi aktif. Cukup masuk ke tab 'Transactions', klik 'Ajukan Komplain (Retur)', dan tuliskan alasan detail kesalahan barang. Penyaluran dana escrow ke penjual otomatis dibekukan sampai tercapai kesepakatan meetup."
                  },
                  {
                    q: "Di mana lokasi aman janjian bertemu (meetup) di kampus UNNES?",
                    a: "Kami sangat menyarankan Anda melakukan janjian di area ramai dan diawasi di lingkungan kampus UNNES, misal: Perpustakaan Pusat UNNES, area Fakultas Teknik (FT), halaman Rektorat, atau kantin utama fakultas Anda masing-masing."
                  },
                  {
                    q: "Berapa biaya admin bertransaksi di Ceksek?",
                    a: "Ceksek berkomitmen mendukung sirkulasi ekonomi mahasiswa. Tidak ada biaya admin, potongan transaksi, atau biaya penarikan ke rekening bank manapun (100% GRATIS dan disubsidi penuh)."
                  }
                ].map((faq, idx) => {
                  const isOpen = activeFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-gray-50/55 transition-all">
                      <button
                        onClick={() => setActiveFaq(isOpen ? null : idx)}
                        className="w-full font-extrabold text-xs text-[#0b1c30] p-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span>{faq.q}</span>
                        <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90 text-[#00288e]' : ''}`} />
                      </button>
                      
                      {isOpen && (
                        <div className="p-4 text-xs text-gray-600 leading-relaxed bg-white border-t border-gray-100">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={() => setShowBantuanModal(false)}
                  className="py-2.5 px-6 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors rounded-xl font-bold text-xs"
                >
                  Tutup
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer component block (Strictly visible on all views) */}
      <footer id="ceksek-footer" className="w-full py-12 px-6 md:px-12 bg-white border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <span className="text-xl font-black text-[#00288e] tracking-tight">Ceksek</span>
            <p className="text-gray-400 text-xs font-semibold">
              © 2026 Ceksek Marketplace. Trustworthy student commerce.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("Hubungi Legal Desk Ceksek: Kebijakan Aturan Penggunaan Platform Khusus UNNES"); }} className="text-gray-400 hover:text-[#00288e] text-xs font-bold transition-colors">Terms of Service</a>
            <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("Hubungi Legal Desk Ceksek: Memahami Privasi Alamat Mahasiswa"); }} className="text-gray-400 hover:text-[#00288e] text-xs font-bold transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("Pusat Informasi & FAQ Penyelesaian Sengketa Escrow"); }} className="text-gray-400 hover:text-[#00288e] text-xs font-bold transition-colors">Help Center</a>
            <a href="#" onClick={(e) => { e.preventDefault(); triggerToast("Safety Handbook: Pedoman Berjualan & Membuka Dagangan Anti Penipuan"); }} className="text-gray-400 hover:text-[#00288e] text-xs font-bold transition-colors">Safety Guide</a>
          </div>
        </div>
      </footer>

      {/* Bottom Floating Navigation for Mobile screens */}
      <div id="ceksek-mobile-nav" className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-100 py-2 px-6 flex justify-around items-center z-45 shadow-lg">
        <button 
          onClick={() => { setActiveTab('home'); setSelectedProduct(null); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'home' ? 'text-[#00288e]' : 'text-gray-400'}`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold">Home</span>
        </button>

        <button 
          onClick={() => { setActiveTab('transactions'); setSelectedProduct(null); }}
          className={`flex flex-col items-center gap-1 p-2 relative ${activeTab === 'transactions' ? 'text-[#00288e]' : 'text-gray-400'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-bold">Transactions</span>
          {transactionStep === 3 && (
            <span className="absolute top-1.5 right-4 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
          )}
        </button>

        <button 
          onClick={() => { setActiveTab('profile'); setSelectedProduct(null); }}
          className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'profile' ? 'text-[#00288e]' : 'text-gray-400'}`}
        >
          <UserCheck className="w-5 h-5" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>

    </div>
  );
}


