'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  FiX,
  FiTag,
  FiLayers,
  FiPlus,
  FiBox,
  FiUpload,
  FiCheck,
  FiHelpCircle,
  FiTrash2,
  FiEye,
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiInfo,
  FiRotateCcw,
  FiRotateCw,
  FiMaximize2,
  FiPlusCircle,
  FiFileText,
  FiChevronRight,
  FiArrowLeft
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import styles from '@/styles/dashboard/products/AddProduct.module.css';
import { supabaseBrowser } from '@/lib/supabase';

// Tour steps definition
const TOUR_STEPS = [
  {
    title: 'Daftar Outlet',
    content: 'Tambahkan produk pada outlet yang diinginkan',
    target: 'outlet'
  },
  {
    title: 'Nama Produk',
    content: 'Masukkan nama produk yang unik dan menarik',
    target: 'name'
  },
  {
    title: 'Deskripsi Produk',
    content: 'Tuliskan deskripsi lengkap mengenai produk Anda',
    target: 'description'
  },
  {
    title: 'Foto Produk',
    content: 'Unggah foto produk terbaik Anda (maks. 10 foto)',
    target: 'photo'
  },
  {
    title: 'Kategori Produk',
    content: 'Pilih kategori yang sesuai untuk produk ini',
    target: 'category'
  },
  {
    title: 'Satuan',
    content: 'Pilih satuan terkecil untuk stok produk Anda',
    target: 'unit'
  },
  {
    title: 'Harga Jual',
    content: 'Tentukan harga jual produk ke pelanggan',
    target: 'price'
  },
  {
    title: 'Simpan',
    content: 'Klik simpan jika semua data sudah benar',
    target: 'save'
  }
];

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const categoryRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<HTMLDivElement>(null);
  const unitRef = React.useRef<HTMLDivElement>(null);
  
  // Tour Refs
  const tourRefs = {
    outlet: useRef<HTMLDivElement>(null),
    name: useRef<HTMLTextAreaElement>(null),
    description: useRef<HTMLTextAreaElement>(null),
    photo: useRef<HTMLDivElement>(null),
    category: useRef<HTMLDivElement>(null),
    unit: useRef<HTMLDivElement>(null),
    price: useRef<HTMLDivElement>(null),
    save: useRef<HTMLButtonElement>(null),
  };

  const [currentStep, setCurrentStep] = useState('informasi');
  const [tourStep, setTourStep] = useState(0); // 0 means no tour, 1-8 are steps
  const [showTour, setShowTour] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, arrow: 'left' });

  const [errors, setErrors] = useState<string[]>([]);
  const [notification, setNotification] = useState<'success' | 'warning' | 'error' | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [currentPreviewImg, setCurrentPreviewImg] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isMirrored, setIsMirrored] = useState(false);
  const [savedImages, setSavedImages] = useState<string[]>([]);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [dragState, setDragState] = useState<{ active: boolean; type: 'move' | 'nw' | 'ne' | 'sw' | 'se' | null; startX: number; startY: number; startBox: typeof cropBox } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInMenu, setShowInMenu] = useState(true);
  const [monitorStock, setMonitorStock] = useState(false);
  const [hasVariants, setHasVariants] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantGroups, setVariantGroups] = useState([
    { id: 1, name: '', options: [{ id: 1, value: '' }] }
  ]);
  type CombinationRow = { name: string; buyPrice: string; salePrice: string; sku: string; showInMenu: boolean };
  const [combinationsData, setCombinationsData] = useState<CombinationRow[]>([{ name: '-', buyPrice: '0', salePrice: '0', sku: '', showInMenu: true }]);
  const [skuErrors, setSkuErrors] = useState<number[]>([]);
  const [hasExtra, setHasExtra] = useState(false);
  const [canEditExtra, setCanEditExtra] = useState(false);
  const [hasRecipe, setHasRecipe] = useState(false);
  const [recipeType, setRecipeType] = useState('manual');
  const [selectedMasterRecipe, setSelectedMasterRecipe] = useState('');
  const [showMasterRecipeModal, setShowMasterRecipeModal] = useState(false);
  const [draftMasterRecipe, setDraftMasterRecipe] = useState('');

  // Sample Data for Master Recipes
  const masterRecipesData = [
    {
      id: 'm122',
      name: 'Teh Tawar',
      ingredients: [
        { name: 'Watter', cost: '0', amount: '1', unit: 'Liter' },
        { name: 'teh kantong', cost: '5.000', amount: '1', unit: 'pcs' }
      ]
    }
  ];

  const [selectedExtra, setSelectedExtra] = useState('');
  const [showExtraDropdown, setShowExtraDropdown] = useState(false);
  const [extraDropdownError, setExtraDropdownError] = useState(false);
  const [activeExtraData, setActiveExtraData] = useState<{
    name: string;
    options: {
      name: string;
      price: string;
      ingredients: { name: string; cost: string; amount: string; unit: string; }[];
    }[];
  } | null>(null);
  
  // Sample Master Data for Extras
  const masterExtras = [
    { 
      name: 'Aluna Tengtop', 
      options: [
        { 
          name: 'Aluna Tengtop XL', 
          price: '0',
          ingredients: [
            { name: 'Aluna Tengtop XL Hitam', cost: '30.000,00', amount: '1', unit: 'Pieces' }
          ]
        },
        { 
          name: 'Aluna Tengtop XL Merah', 
          price: '0',
          ingredients: [
            { name: 'Aluna Tengtop XL Merah', cost: '50.000,00', amount: '1', unit: 'Pieces' }
          ]
        }
      ] 
    },
    { 
      name: 'Adonana', 
      options: [
        { name: 'Pandan', price: '3.000', ingredients: [] },
        { name: 'Coklat', price: '3.000', ingredients: [] },
        { name: 'Redvelvet', price: '3.000', ingredients: [] },
        { name: 'Mix', price: '5.000', ingredients: [] }
      ] 
    },
    { 
      name: 'Ekstra Saus', 
      options: [
        { name: 'Saus Tomat', price: '0', ingredients: [] },
        { name: 'Saus Sambal', price: '0', ingredients: [] }
      ] 
    }
  ];
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const groups = ['Grup A', 'Grup B', 'Grup C'];
  const [hasSerialNumber, setHasSerialNumber] = useState(false);
  const [hasBatchNumber, setHasBatchNumber] = useState(false);
  const [canChangePrice, setCanChangePrice] = useState(false);
  const [canEditAvailability, setCanEditAvailability] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [isOutletDropdownOpen, setIsOutletDropdownOpen] = useState(false);
  const [outletsList, setOutletsList] = useState<{id: string, name: string}[]>([]);
  const [isLoadingOutlets, setIsLoadingOutlets] = useState(true);
  const [selectedOutlets, setSelectedOutlets] = useState<string[]>([]);
  const [categoryFormData, setCategoryFormData] = useState({
    outlets: '',
    name: '',
    order: '',
    department: '',
    showInMenu: false
  });

  // Fetch Outlets from API (Server Side is usually faster)
  useEffect(() => {
    const fetchOutlets = async () => {
      setIsLoadingOutlets(true);
      try {
        const response = await fetch('/api/dashboard/outlets');
        const result = await response.json();
        
        if (result.success && result.data && result.data.length > 0) {
          const data = result.data;
          setOutletsList(data);
          setSelectedOutlets(data.map((o: any) => o.name));
          setFormData(prev => ({ ...prev, outlet: data[0].name }));
          setCategoryFormData(prev => ({ ...prev, outlets: data[0].name }));
          setIsLoadingOutlets(false);
          return;
        }
      } catch (err) {
        console.error("Error fetching outlets:", err);
      }
      
      // Fallback if database is completely empty or error occurs
      const fallbackOutlet = { id: 'fallback-1', name: 'Rupa Leather' };
      setOutletsList([fallbackOutlet]);
      setSelectedOutlets([fallbackOutlet.name]);
      setFormData(prev => ({ ...prev, outlet: fallbackOutlet.name }));
      setCategoryFormData(prev => ({ ...prev, outlets: fallbackOutlet.name }));
      setIsLoadingOutlets(false);
    };
    fetchOutlets();
  }, []);

  // Force show tour for debugging
  useEffect(() => {
    console.log('🏁 Tour Force Start');
    setShowTour(true);
    setTourStep(1);
  }, []);

  // Update popover position when tour step changes
  useEffect(() => {
    if (!showTour || tourStep === 0) return;

    const step = TOUR_STEPS[tourStep - 1];
    const targetRef = tourRefs[step.target as keyof typeof tourRefs];

    console.log('📍 Step:', tourStep, 'Target:', step.target, 'Ref exists:', !!targetRef.current);

    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      console.log('📐 Rect:', rect);
      
      setPopoverPos({
        top: rect.top, // Use viewport relative since popover will be fixed
        left: rect.left - 340,
        arrow: 'right'
      });

      targetRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [tourStep, showTour]);

  const handleNextTour = () => {
    console.log('Next tour step from:', tourStep);
    if (tourStep < 8) {
      setTourStep(prev => prev + 1);
    } else {
      handleSkipTour();
    }
  };

  const handleSkipTour = () => {
    console.log('Skipping/Finishing tour');
    setShowTour(false);
    setTourStep(0);
    localStorage.setItem('hasSeenAddProductTour', 'true');
  };

  const restartTour = () => {
    localStorage.removeItem('hasSeenAddProductTour');
    setTourStep(1);
    setShowTour(true);
  };

  // Sync combinations whenever variantGroups change
  useEffect(() => {
    const activeGroups = variantGroups.filter(g => g.name.trim() !== '' && g.options.some(o => o.value.trim() !== ''));
    let newCombos: CombinationRow[];
    if (activeGroups.length === 0) {
      newCombos = [{ name: '-', buyPrice: '0', salePrice: '0', sku: '', showInMenu: true }];
    } else {
      let result: string[][] = [[]];
      activeGroups.forEach(group => {
        let temp: string[][] = [];
        const groupOptions = group.options.filter(o => o.value.trim() !== '');
        result.forEach(r => { groupOptions.forEach(o => { temp.push([...r, o.value]); }); });
        result = temp;
      });
      newCombos = result.map(combo => ({ name: combo.join(', '), buyPrice: '0', salePrice: '0', sku: '', showInMenu: true }));
    }
    setCombinationsData(prev => {
      // Preserve existing edited values where name matches
      return newCombos.map(nc => {
        const existing = prev.find(p => p.name === nc.name);
        return existing ? existing : nc;
      });
    });
  }, [variantGroups]);

  const combinations = combinationsData;

  // Form Data State
  const [formData, setFormData] = useState({
    outlet: '',
    name: '',
    category: '',
    description: '',
    unit: '',
    sku: '',
    conversion: '1',
    minPurchase: '1',
    salePrice: '0',
    buyPrice: '0',
    volumeP: '1',
    volumeL: '1',
    volumeT: '1',
    weight: '100',
    group: ''
  });

  const isFormValid =
    selectedOutlets.length > 0 &&
    formData.name.trim() !== '' &&
    formData.category !== '' &&
    formData.unit !== '' &&
    formData.sku !== '' &&
    formData.minPurchase !== '' &&
    formData.salePrice !== '' &&
    formData.volumeP !== '' &&
    formData.volumeL !== '' &&
    formData.volumeT !== '' &&
    formData.weight !== '';

  const formatRupiah = (value: string) => {
    if (!value) return '0';
    let numberString = value.replace(/[^0-9]/g, '');
    if (!numberString) return '0';
    numberString = numberString.replace(/^0+(?=\d)/, '');
    return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOutletDropdownOpen(false);
      }
    };

    if (isOutletDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOutletDropdownOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'salePrice' || name === 'buyPrice') {
      // Allow only numbers and format with dots
      const numericValue = value.replace(/[^0-9]/g, '');
      const formatted = formatRupiah(numericValue);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else if (e.target.type === 'number' && value.length > 1 && value.startsWith('0')) {
      const newValue = value.replace(/^0+/, '');
      setFormData(prev => ({ ...prev, [name]: newValue || '0' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field if user starts typing
    if (errors.includes(name)) {
      setErrors(prev => prev.filter(err => err !== name));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const availableSlots = 10 - savedImages.length;
    const filesToProcess = files.slice(0, availableSlots);

    if (filesToProcess.length === 1 && replacingIndex === null) {
      const file = filesToProcess[0];
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowCropModal(true);
      setRotation(0); 
      setIsMirrored(false);
      
      if (file.size > 1024 * 1024) { // 1MB
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    } else if (filesToProcess.length > 0) {
      if (replacingIndex !== null) {
        const file = filesToProcess[0];
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setShowCropModal(true);
        setRotation(0); 
        setIsMirrored(false);
      } else {
        const newUrls = filesToProcess.map(f => URL.createObjectURL(f));
        setSavedImages(prev => [...prev, ...newUrls]);
      }
    }

    // Reset input value so same file can be selected again
    e.target.value = '';
  };
  const getCroppedImg = async (imageSrc: string, crop: { x: number, y: number, width: number, height: number }, rotation: number, isMirrored: boolean): Promise<string> => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imageSrc);

        const size = Math.max(image.width, image.height);
        canvas.width = size;
        canvas.height = size;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        const dx = (size - image.width) / 2;
        const dy = (size - image.height) / 2;

        ctx.translate(size / 2, size / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(isMirrored ? -1 : 1, 1);
        ctx.translate(-size / 2, -size / 2);

        ctx.drawImage(image, dx, dy);

        const croppedCanvas = document.createElement('canvas');
        const cropCtx = croppedCanvas.getContext('2d');
        if (!cropCtx) return resolve(imageSrc);

        const cropX = (crop.x / 100) * size;
        const cropY = (crop.y / 100) * size;
        const cropW = (crop.width / 100) * size;
        const cropH = (crop.height / 100) * size;

        croppedCanvas.width = cropW;
        croppedCanvas.height = cropH;

        cropCtx.drawImage(
          canvas,
          cropX, cropY, cropW, cropH,
          0, 0, cropW, cropH
        );

        resolve(croppedCanvas.toDataURL('image/jpeg', 0.9));
      };
      image.onerror = () => resolve(imageSrc);
    });
  };

  const handleCropStart = (e: React.MouseEvent, type: 'move' | 'nw' | 'ne' | 'sw' | 'se') => {
    e.preventDefault();
    setDragState({
      active: true,
      type,
      startX: e.clientX,
      startY: e.clientY,
      startBox: { ...cropBox }
    });
  };

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState?.active) return;

      // Use a fixed denominator for percentage calculation based on estimated preview container size
      const deltaX = ((e.clientX - dragState.startX) / 450) * 100; 
      const deltaY = ((e.clientY - dragState.startY) / 450) * 100;

      setCropBox(prev => {
        let { x, y, width, height } = { ...dragState.startBox };

        if (dragState.type === 'move') {
          x = Math.max(0, Math.min(100 - width, x + deltaX));
          y = Math.max(0, Math.min(100 - height, y + deltaY));
        } else if (dragState.type === 'nw') {
          x = Math.max(0, Math.min(dragState.startBox.x + dragState.startBox.width - 10, x + deltaX));
          y = Math.max(0, Math.min(dragState.startBox.y + dragState.startBox.height - 10, y + deltaY));
          width = dragState.startBox.width - (x - dragState.startBox.x);
          height = dragState.startBox.height - (y - dragState.startBox.y);
        } else if (dragState.type === 'se') {
          width = Math.max(10, Math.min(100 - x, width + deltaX));
          height = Math.max(10, Math.min(100 - y, height + deltaY));
        } else if (dragState.type === 'ne') {
          y = Math.max(0, Math.min(dragState.startBox.y + dragState.startBox.height - 10, y + deltaY));
          width = Math.max(10, Math.min(100 - x, width + deltaX));
          height = dragState.startBox.height - (y - dragState.startBox.y);
        } else if (dragState.type === 'sw') {
          x = Math.max(0, Math.min(dragState.startBox.x + dragState.startBox.width - 10, x + deltaX));
          width = dragState.startBox.width - (x - dragState.startBox.x);
          height = Math.max(10, Math.min(100 - y, height + deltaY));
        }

        return { x, y, width, height };
      });
    };

    const handleMouseUp = () => setDragState(null);

    if (dragState?.active) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState]);

  // Handle click outside for dropdowns
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (groupRef.current && !groupRef.current.contains(event.target as Node)) {
        setIsGroupOpen(false);
      }
      if (unitRef.current && !unitRef.current.contains(event.target as Node)) {
        setIsUnitOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSave = () => {
    const newErrors: string[] = [];
    if (selectedOutlets.length === 0) newErrors.push('outlet');
    if (!formData.name.trim()) newErrors.push('name');
    if (!formData.category) newErrors.push('category');
    if (!formData.unit) newErrors.push('unit');
    if (!formData.sku) newErrors.push('sku');
    if (!formData.minPurchase || formData.minPurchase === '0') newErrors.push('minPurchase');
    if (!formData.salePrice || formData.salePrice === '0') newErrors.push('salePrice');
    if (!formData.volumeP || formData.volumeP === '0') newErrors.push('volumeP');
    if (!formData.volumeL || formData.volumeL === '0') newErrors.push('volumeL');
    if (!formData.volumeT || formData.volumeT === '0') newErrors.push('volumeT');
    if (!formData.weight || formData.weight === '0') newErrors.push('weight');

    setErrors(newErrors);

    if (newErrors.length === 0) {
      if (currentStep === 'review') {
        router.push('/dashboard/products');
      } else {
        setCurrentStep('review');
        window.scrollTo(0, 0);
      }
    } else {
      if (currentStep !== 'informasi') {
        setCurrentStep('informasi');
      }
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    }
  };

  const handleNext = () => {
    if (currentStep === 'varian') {
      // Validate SKU for all combination rows
      const emptySkuIndexes = combinationsData
        .map((row, i) => row.sku.trim() === '' ? i : -1)
        .filter(i => i !== -1);
      if (emptySkuIndexes.length > 0) {
        setSkuErrors(emptySkuIndexes);
        return;
      }
      setSkuErrors([]);
      setCurrentStep('ekstra');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 'ekstra') {
      setCurrentStep('resep');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 'resep') {
      setCurrentStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const newErrors: string[] = [];
    if (selectedOutlets.length === 0) newErrors.push('outlet');
    if (!formData.name.trim()) newErrors.push('name');
    if (!formData.category) newErrors.push('category');
    if (!formData.unit) newErrors.push('unit');
    if (!formData.sku) newErrors.push('sku');
    if (!formData.minPurchase || formData.minPurchase === '0') newErrors.push('minPurchase');
    if (!formData.salePrice || formData.salePrice === '0') newErrors.push('salePrice');
    if (!formData.volumeP || formData.volumeP === '0') newErrors.push('volumeP');
    if (!formData.volumeL || formData.volumeL === '0') newErrors.push('volumeL');
    if (!formData.volumeT || formData.volumeT === '0') newErrors.push('volumeT');
    
    setErrors(newErrors);
    
    if (newErrors.length === 0) {
      setCurrentStep('varian');
    } else {
      // Scroll to the first error or top of the form if needed
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleVariants = () => {
    if (!hasVariants) {
      setShowVariantModal(true);
    } else {
      setHasVariants(false);
    }
  };

  const confirmVariants = () => {
    setHasVariants(true);
    setShowVariantModal(false);
  };

  // Logic for adding a new Variant Type (Nama Varian)
  const handleAddVariantGroup = () => {
    if (variantGroups.length < 3) { // Majoo usually limits to 3 groups
      setVariantGroups([
        ...variantGroups,
        { id: Date.now(), name: '', options: [{ id: Date.now(), value: '' }] }
      ]);
    }
  };

  const handleDeleteVariantGroup = (groupId: number) => {
    if (variantGroups.length > 1) {
      setVariantGroups(variantGroups.filter(g => g.id !== groupId));
    } else {
      setHasVariants(false);
      setVariantGroups([{ id: 1, name: '', options: [{ id: 1, value: '' }] }]);
    }
  };

  const handleGroupChange = (groupId: number, field: string, value: string) => {
    setVariantGroups(variantGroups.map(g => g.id === groupId ? { ...g, [field]: value } : g));
  };

  const handleAddOption = (groupId: number) => {
    setVariantGroups(variantGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          options: [...g.options, { id: Date.now(), value: '' }]
        };
      }
      return g;
    }));
  };

  const handleDeleteOption = (groupId: number, optionId: number) => {
    setVariantGroups(variantGroups.map(g => {
      if (g.id === groupId && g.options.length > 1) {
        return {
          ...g,
          options: g.options.filter(o => o.id !== optionId)
        };
      }
      return g;
    }));
  };

  const handleOptionValueChange = (groupId: number, optionId: number, value: string) => {
    setVariantGroups(variantGroups.map(g => {
      if (g.id === groupId) {
        return {
          ...g,
          options: g.options.map(o => o.id === optionId ? { ...o, value } : o)
        };
      }
      return g;
    }));
  };

  return (
    <div className={styles.container}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <FiX className={styles.closeBtn} onClick={() => setShowCancelConfirmModal(true)} />
          <h1 className={styles.title}>{currentStep === 'review' ? 'Detail Produk' : 'Tambah Produk'}</h1>
        </div>

        {currentStep === 'review' ? null : (
          <nav className={styles.steps}>
            <div className={`${styles.step} ${currentStep === 'informasi' ? styles.stepActive : ''}`}>
              <div className={styles.stepIcon}><FiTag /></div>
              <span>Informasi Produk</span>
            </div>
            <div className={`${styles.step} ${currentStep === 'varian' ? styles.stepActive : ''}`}>
              <div className={styles.stepIcon}><FiLayers /></div>
              <span>Varian</span>
            </div>
            <div className={`${styles.step} ${currentStep === 'ekstra' ? styles.stepActive : ''}`}>
              <div className={styles.stepIcon}><FiPlus /></div>
              <span>Ekstra</span>
            </div>
            <div className={`${styles.step} ${currentStep === 'resep' ? styles.stepActive : ''}`}>
              <div className={styles.stepIcon}><FiBox /></div>
              <span>Bahan Baku</span>
            </div>
          </nav>
        )}

        <div className={styles.topBarRight}>
          <button className={styles.helpBtn} onClick={restartTour} title="Ulangi Panduan">
            <FiHelpCircle />
            <span>Bantuan</span>
          </button>
        </div>
      </header>

      {/* Scrollable Form Content */}
      <div className={styles.scrollArea}>
        <div className={styles.formCard}>
          {currentStep === 'review' ? (
            <div className={styles.reviewCard}>
              <h2 className={styles.reviewSectionTitle}>Detail Produk</h2>
              
              <div className={styles.reviewSection}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>Informasi Produk:</h4>
                <div className={styles.reviewTable}>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Daftar Outlet</div>
                    <div className={styles.reviewValue}>{selectedOutlets.join(', ') || '-'}</div>
                  </div>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Nama Produk</div>
                    <div className={styles.reviewValue}>{formData.name || 'Tas Zeus'}</div>
                  </div>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Deskripsi</div>
                    <div className={styles.reviewValue}>Tas Premium</div>
                  </div>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Kategori</div>
                    <div className={styles.reviewValue}>{formData.category || 'Tas Pria'}</div>
                  </div>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Foto Produk</div>
                    <div className={styles.reviewValue}>
                      {savedImages.length > 0 ? (
                        <div className={styles.reviewImageGrid}>
                          {savedImages.map((img, i) => (
                            <img key={i} src={img} className={styles.reviewImage} alt="Preview" />
                          ))}
                        </div>
                      ) : (
                        <img src="https://down-id.img.susercontent.com/file/id-11134207-7r98r-llu5w8r5u5r57b" className={styles.reviewImage} alt="Tas Zeus" />
                      )}
                    </div>
                  </div>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Grup Induk</div>
                    <div className={styles.reviewValue}>{formData.group || '-'}</div>
                  </div>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>Harga dan Satuan:</h4>
                <div className={styles.reviewGridHeader}>
                  <div>Satuan</div>
                  <div>Harga Beli</div>
                  <div>Harga Jual</div>
                  <div>SKU</div>
                  <div>Min. Pembelian</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr', padding: '1rem', borderBottom: '1px solid #f1f5f9', textAlign: 'center', fontSize: '0.9rem', color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <FiChevronDown /> Pieces
                  </div>
                  <div>Rp 0</div>
                  <div>Rp 349.900,00</div>
                  <div>SZ01</div>
                  <div>1</div>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>Harga Grosir:</h4>
                <div className={styles.reviewGridHeader} style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div>Jumlah Minimal</div>
                  <div>Harga Satuan</div>
                </div>
                <div className={styles.emptyStateContainer}>
                  <FiTag style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '1rem' }} />
                  <h4 className={styles.emptyTitle}>Data tidak tersedia</h4>
                  <p className={styles.emptySub}>Belum ada data yang dapat ditampilkan di halaman ini</p>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>Varian:</h4>
                <div className={styles.reviewGridHeader} style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr' }}>
                  <div>Varian</div>
                  <div>Harga Modal</div>
                  <div>Harga Beli</div>
                  <div>Harga Jual</div>
                  <div>SKU</div>
                  <div>Status</div>
                </div>
                <div className={styles.emptyStateContainer}>
                  <FiLayers style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '1rem' }} />
                  <h4 className={styles.emptyTitle}>Data tidak tersedia</h4>
                  <p className={styles.emptySub}>Belum ada data yang dapat ditampilkan di halaman ini</p>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>Ekstra:</h4>
                <div className={styles.emptyStateContainer}>
                  <FiPlusCircle style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '1rem' }} />
                  <h4 className={styles.emptyTitle}>Data tidak tersedia</h4>
                  <p className={styles.emptySub}>Belum ada data yang dapat ditampilkan di halaman ini</p>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>Resep:</h4>
                <div className={styles.reviewGridHeader} style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <div>Bahan Baku</div>
                  <div>Takaran</div>
                  <div>Satuan</div>
                </div>
                <div className={styles.emptyStateContainer}>
                  <FiFileText style={{ fontSize: '3.5rem', color: '#cbd5e1', marginBottom: '1rem' }} />
                  <h4 className={styles.emptyTitle}>Data tidak tersedia</h4>
                  <p className={styles.emptySub}>Belum ada data yang dapat ditampilkan di halaman ini</p>
                </div>
              </div>

              <div className={styles.reviewSection}>
                <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', fontWeight: 600 }}>web order:</h4>
                <div className={styles.reviewTable}>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Status</div>
                    <div className={styles.reviewValue}>Tidak Aktif</div>
                  </div>
                  <div className={styles.reviewRow}>
                    <div className={styles.reviewLabel}>Spesifikasi Produk</div>
                    <div className={styles.reviewValue}>-</div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentStep === 'informasi' ? (
            <>
              {/* Informasi Produk Section */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Informasi Produk</h2>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol} style={{ paddingTop: '0rem', paddingBottom: '1.75rem' }}>Daftar Outlet<span style={{ color: '#ef4444' }}>*</span></div>
                  <div className={styles.rightCol} style={{ paddingTop: '0.15rem', paddingBottom: '0.7rem' }}>
                    <div style={{ position: 'relative' }} ref={tourRefs.outlet}>
                      <div className={styles.customSelect} onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}>
                        <span style={{ color: selectedOutlets.length > 0 ? '#0f172a' : '#94a3b8' }}>
                          {isLoadingOutlets 
                            ? 'Memuat Outlet...' 
                            : selectedOutlets.length === outletsList.length && outletsList.length > 0
                              ? 'Semua Outlet'
                              : selectedOutlets.length > 0
                                ? `${selectedOutlets.length} Outlet Terpilih`
                                : 'Pilih Outlet'
                          }
                        </span>
                        <FiChevronDown style={{ fontSize: '1.2rem', color: '#0f172a' }} />
                      </div>

                      {isOutletDropdownOpen && (
                        <>
                          <div 
                            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 }} 
                            onClick={() => setIsOutletDropdownOpen(false)} 
                          />
                          <div className={styles.dropdownMenu} style={{ zIndex: 50 }}>
                            <div 
                              className={styles.dropdownItem}
                              onClick={() => {
                                if (selectedOutlets.length === outletsList.length) {
                                  setSelectedOutlets([]);
                                } else {
                                  setSelectedOutlets(outletsList.map(o => o.name));
                                }
                              }}
                            >
                              <input 
                                type="checkbox" 
                                className={styles.checkboxReal} 
                                checked={selectedOutlets.length === outletsList.length && outletsList.length > 0} 
                                onChange={() => {}}
                              />
                              <span>Pilih Semua</span>
                            </div>
                            {outletsList.map(outlet => (
                              <div 
                                key={outlet.id} 
                                className={styles.dropdownItem}
                                onClick={() => {
                                  if (selectedOutlets.includes(outlet.name)) {
                                    setSelectedOutlets(selectedOutlets.filter(name => name !== outlet.name));
                                  } else {
                                    setSelectedOutlets([...selectedOutlets, outlet.name]);
                                  }
                                }}
                              >
                                <input 
                                  type="checkbox" 
                                  className={styles.checkboxReal} 
                                  checked={selectedOutlets.includes(outlet.name)}
                                  onChange={() => {}}
                                />
                                <span>{outlet.name}</span>
                                <span className={styles.outletCount}>1 Outlet</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                      {selectedOutlets.map(name => (
                        <div key={name} className={styles.tag}>
                          {name} <FiX style={{ cursor: 'pointer' }} onClick={() => setSelectedOutlets(selectedOutlets.filter(n => n !== name))} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow} style={{ marginBottom: '0.4rem' }}>
                  <div className={styles.leftCol} style={{ paddingTop: '1.05rem', paddingBottom: '0.7rem' }}>Nama Produk<span style={{ color: '#ef4444' }}>*</span></div>
                  <div className={styles.rightCol} style={{ paddingTop: '0.15rem', paddingBottom: '0.7rem' }}>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        name="name"
                        ref={tourRefs.name}
                        className={`${styles.input} ${styles.textarea} ${errors.includes('name') ? styles.inputError : ''}`}
                        placeholder="Contoh: nasi padang"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{ height: '60px' }}
                      />
                      <span style={{ position: 'absolute', right: '0', top: '-1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>{formData.name.length}/255</span>
                      {errors.includes('name') && <p className={styles.errorText}>*Mohon lengkapi data</p>}
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow} style={{ marginBottom: '0.4rem' }}>
                  <div className={styles.leftCol} style={{ paddingTop: '1.05rem', paddingBottom: '0.7rem' }}>Deskripsi Produk</div>
                  <div className={styles.rightCol} style={{ paddingTop: '0.15rem', paddingBottom: '0.7rem' }}>
                    <textarea
                      ref={tourRefs.description}
                      className={`${styles.input} ${styles.textarea}`}
                      placeholder="Contoh: yang best seller"
                      style={{ height: '60px' }}
                    />
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>
                    Foto Produk
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginTop: '0.5rem', textTransform: 'none', lineHeight: '1.4' }}>
                      Gunakan rasio foto 1:1 dengan ukuran 10Kb dan maksimal 1Mb. Format foto .jpg .jpeg .png ukuran minimum 100px x 100px (Untuk gambar optimal gunakan ukuran maksimum 1000px x 1000px). Maksimal 10 foto
                    </div>
                  </div>
                  <div className={styles.rightCol} style={{ paddingTop: '1.05rem', paddingBottom: '0.7rem' }}>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: 'none' }} 
                      accept="image/*" 
                      onChange={handleFileChange}
                      multiple 
                    />
                    <div className={styles.imageGrid}>
                      {savedImages.map((img, index) => (
                        <div key={index} className={styles.imageCard}>
                          <div className={styles.imageWrapper}>
                            <img src={img} alt={`Product ${index}`} />
                            <button 
                              className={styles.deleteBtn} 
                              onClick={() => setSavedImages(prev => prev.filter((_, i) => i !== index))}
                            >
                              <FiX size={14} />
                            </button>
                            <div 
                                className={styles.imageOverlay}
                                onClick={() => {
                                  setCurrentPreviewImg(img);
                                  setShowPreviewModal(true);
                                }}
                              >
                                <FiEye />
                              </div>
                          </div>
                          <button 
                            className={styles.changeFileBtn}
                            onClick={() => {
                              setReplacingIndex(index);
                              fileInputRef.current?.click();
                            }}
                          >
                            Ganti File
                          </button>
                        </div>
                      ))}
                      
                      {savedImages.length < 10 && (
                        <div 
                          className={styles.uploadBoxSmall} 
                          ref={tourRefs.photo}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <FiUpload style={{ fontSize: '1.5rem', color: '#94a3b8' }} />
                          <span style={{ fontSize: '0.75rem', textAlign: 'center', padding: '0 1rem' }}>Pilih atau letakkan berkas di sini</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Kategori Produk<span style={{ color: '#ef4444' }}>*</span></div>
                  <div className={styles.rightCol} style={{ paddingTop: '0.4rem' }}>
                    <div className={styles.customDropdown} ref={tourRefs.category}>
                      <div 
                        className={`${styles.dropdownHeader} ${isCategoryOpen ? styles.dropdownHeaderActive : ''} ${errors.includes('category') ? styles.inputError : ''}`}
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      >
                        {formData.category || 'Pilih Kategori'}
                        <FiChevronDown style={{ 
                          transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s'
                        }} />
                      </div>
                      
                      {isCategoryOpen && (
                        <div className={styles.dropdownList}>
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <div 
                                key={cat} 
                                className={styles.dropdownItem}
                                onClick={() => {
                                  handleInputChange({ target: { name: 'category', value: cat } } as any);
                                  setIsCategoryOpen(false);
                                }}
                              >
                                {cat}
                              </div>
                            ))
                          ) : (
                            <div className={styles.dropdownItem} style={{ color: '#94a3b8', cursor: 'default' }}>
                              Belum ada kategori
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {errors.includes('category') && <p className={styles.errorText}>*Mohon lengkapi data</p>}
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                      Kategori belum tersedia? <span className={styles.link} onClick={() => setShowAddCategory(true)}>Buat Kategori Baru</span>
                    </p>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Opsi Lanjutan</div>
                  <div className={styles.rightCol}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input 
                          type="checkbox" 
                          className={styles.checkboxReal} 
                          checked={isFavorite}
                          onChange={() => setIsFavorite(!isFavorite)}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Produk Favorit</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input 
                          type="checkbox" 
                          className={styles.checkboxReal} 
                          checked={showInMenu}
                          onChange={() => setShowInMenu(!showInMenu)}
                        />
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Tampil di Menu</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Monitor Persediaan</div>
                  <div className={styles.rightCol}>
                    <div className={styles.toggleSection} style={{ marginBottom: '0.75rem' }}>
                      <div 
                        className={`${styles.toggle} ${monitorStock ? styles.toggleActive : ''}`}
                        onClick={() => {
                          const newState = !monitorStock;
                          setMonitorStock(newState);
                          if (!newState) {
                            setHasSerialNumber(false);
                            setHasBatchNumber(false);
                          }
                        }}
                      >
                        <div className={styles.toggleCircle}></div>
                        <span className={styles.toggleOnText}>ON</span>
                        <span className={styles.toggleOffText}>OFF</span>
                      </div>
                      <span style={{ fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Aktifkan monitor persediaan untuk produk ini</span>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        Stok Minimum Produk 
                        <div className={styles.tooltipContainer}>
                          <FiInfo style={{ color: '#64748b' }} />
                          <div className={styles.tooltipText}>
                            Aktifkan notifikasi pengingat inventori melalui menu Pengaturan Notifikasi
                          </div>
                        </div>
                      </label>
                      <input type="number" className={styles.input} defaultValue="0" style={{ background: '#f1f5f9' }} />
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>
                    Serial Number 
                    <div className={styles.tooltipContainer} style={{ marginLeft: '0.4rem' }}>
                      <FiInfo style={{ color: '#64748b' }} />
                      <div className={styles.tooltipText}>
                        Aktifkan monitor persediaan untuk mengaktifkan serial number
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginTop: '0.4rem', textTransform: 'none' }}>
                      Kasir wajib memilih manual serial number saat penjualan
                    </div>
                  </div>
                  <div className={styles.rightCol}>
                    <div className={styles.toggleSection}>
                      <div 
                        className={`${styles.toggle} ${hasSerialNumber ? styles.toggleActive : ''}`}
                        onClick={() => monitorStock && setHasSerialNumber(!hasSerialNumber)}
                        style={{ opacity: monitorStock ? 1 : 0.5, cursor: monitorStock ? 'pointer' : 'not-allowed' }}
                      >
                        <div className={styles.toggleCircle}></div>
                        <span className={styles.toggleOnText}>ON</span>
                        <span className={styles.toggleOffText}>OFF</span>
                      </div>
                      <span style={{ fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Aktifkan produk memiliki Serial Number</span>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>
                    Batch Number 
                    <div className={styles.tooltipContainer} style={{ marginLeft: '0.4rem' }}>
                      <FiInfo style={{ color: '#64748b' }} />
                      <div className={styles.tooltipText}>
                        Aktifkan monitor persediaan untuk mengaktifkan batch number
                      </div>
                    </div>
                  </div>
                  <div className={styles.rightCol}>
                    <div className={styles.toggleSection}>
                      <div 
                        className={`${styles.toggle} ${hasBatchNumber ? styles.toggleActive : ''}`}
                        onClick={() => monitorStock && setHasBatchNumber(!hasBatchNumber)}
                        style={{ opacity: monitorStock ? 1 : 0.5, cursor: monitorStock ? 'pointer' : 'not-allowed' }}
                      >
                        <div className={styles.toggleCircle}></div>
                        <span className={styles.toggleOnText}>ON</span>
                        <span className={styles.toggleOffText}>OFF</span>
                      </div>
                      <span style={{ fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Aktifkan produk memiliki Batch Number</span>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Grup</div>
                  <div className={styles.rightCol}>
                    <div className={styles.customDropdown} ref={groupRef}>
                      <div 
                        className={`${styles.dropdownHeader} ${isGroupOpen ? styles.dropdownHeaderActive : ''}`}
                        onClick={() => setIsGroupOpen(!isGroupOpen)}
                      >
                        {formData.group || 'Pilih Grup'}
                        <FiChevronDown style={{ 
                          transform: isGroupOpen ? 'rotate(180deg)' : 'rotate(0)',
                          transition: 'transform 0.2s'
                        }} />
                      </div>
                      
                      {isGroupOpen && (
                        <div className={styles.dropdownList}>
                          {groups.map((group) => (
                            <div 
                              key={group} 
                              className={styles.dropdownItem}
                              onClick={() => {
                                handleInputChange({ target: { name: 'group', value: group } } as any);
                                setIsGroupOpen(false);
                              }}
                            >
                              {group}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginTop: '0.75rem' }}>
                      <input type="checkbox" className={styles.checkboxReal} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#475569' }}>Tetapkan sebagai Induk</span>
                    </label>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Izinkan Ubah Produk Tidak Dijual</div>
                  <div className={styles.rightCol}>
                    <div className={styles.toggleSection}>
                      <div 
                        className={`${styles.toggle} ${canEditAvailability ? styles.toggleActive : ''}`}
                        onClick={() => setCanEditAvailability(!canEditAvailability)}
                      >
                        <div className={styles.toggleCircle}></div>
                        <span className={styles.toggleOnText}>ON</span>
                        <span className={styles.toggleOffText}>OFF</span>
                      </div>
                      <span style={{ fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Izinkan kasir mengubah produk menjadi tidak tersedia/tidak dapat dijual di POS/Order Online</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Harga dan Satuan Section */}
              <section className={styles.section} style={{ borderTop: '1px solid #f1f5f9', paddingTop: '2.5rem' }}>
                <h2 className={styles.sectionTitle}>Harga dan Satuan</h2>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Satuan<span style={{ color: '#ef4444' }}>*</span></div>
                  <div className={styles.rightCol}>
                    <div className={styles.grid2} style={{ marginBottom: '0.75rem' }}>
                      <div className={styles.inputGroup}>
                        <label className={`${styles.label} ${styles.labelRequired}`}>Satuan<span style={{ color: '#ef4444' }}>*</span></label>
                        <div className={styles.customDropdown} ref={tourRefs.unit}>
                          <div 
                            className={`${styles.dropdownHeader} ${isUnitOpen ? styles.dropdownHeaderActive : ''} ${errors.includes('unit') ? styles.inputError : ''}`}
                            onClick={() => setIsUnitOpen(!isUnitOpen)}
                          >
                            {formData.unit || 'Pilih'}
                            <FiChevronDown style={{ 
                              transform: isUnitOpen ? 'rotate(180deg)' : 'rotate(0)',
                              transition: 'transform 0.2s'
                            }} />
                          </div>
                          
                          {isUnitOpen && (
                            <div className={styles.dropdownList}>
                              {['Pcs', 'Box', 'Karton'].map((opt) => (
                                <div 
                                  key={opt} 
                                  className={styles.dropdownItem}
                                  onClick={() => {
                                    handleInputChange({ target: { name: 'unit', value: opt } } as any);
                                    setIsUnitOpen(false);
                                  }}
                                >
                                  {opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {errors.includes('unit') && <p className={styles.errorText}>*Mohon lengkapi data</p>}
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={`${styles.label} ${styles.labelRequired}`}>SKU<span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          type="text"
                          name="sku"
                          className={`${styles.input} ${errors.includes('sku') ? styles.inputError : ''}`}
                          placeholder="Contoh: S001"
                          value={formData.sku}
                          onChange={handleInputChange}
                        />
                        {errors.includes('sku') && <p className={styles.errorText}>*Mohon lengkapi data</p>}
                      </div>
                    </div>
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Konversi</label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="number"
                            name="conversion"
                            className={styles.input}
                            value={formData.conversion}
                            onChange={handleInputChange}
                            style={{ background: '#f8fafc' }}
                          />
                          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#94a3b8', fontSize: '0.85rem' }}>{formData.unit}</span>
                        </div>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={`${styles.label} ${styles.labelRequired}`}>Min. Pembelian<span style={{ color: '#ef4444' }}>*</span></label>
                        <input
                          type="number"
                          name="minPurchase"
                          className={`${styles.input} ${errors.includes('minPurchase') ? styles.inputError : ''}`}
                          value={formData.minPurchase}
                          onChange={handleInputChange}
                        />
                        {errors.includes('minPurchase') && <p className={styles.errorText}>*Mohon lengkapi data</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Harga<span style={{ color: '#ef4444' }}>*</span></div>
                  <div className={styles.rightCol}>
                    <div className={styles.grid2}>
                      <div className={styles.inputGroup}>
                        <label className={`${styles.label} ${styles.labelRequired}`}>Harga Jual<span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ position: 'relative' }} ref={tourRefs.price}>
                          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Rp</span>
                          <input
                            type="text"
                            name="salePrice"
                            className={`${styles.input} ${errors.includes('salePrice') ? styles.inputError : ''}`}
                            style={{ paddingLeft: '3rem' }}
                            value={formData.salePrice}
                            onChange={handleInputChange}
                          />
                        </div>
                        {errors.includes('salePrice') && <p className={styles.errorText}>*Mohon lengkapi data</p>}
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Harga Beli</label>
                        <div style={{ position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#94a3b8', fontSize: '0.9rem' }}>Rp</span>
                          <input
                            type="text"
                            name="buyPrice"
                            className={styles.input}
                            style={{ paddingLeft: '3rem', background: '#f1f5f9', cursor: 'not-allowed' }}
                            value={formData.buyPrice}
                            readOnly
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Dimensi Produk<span style={{ color: '#ef4444' }}>*</span></div>
                  <div className={styles.rightCol}>
                    <div className={styles.grid2}>
                      <div>
                        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          Volume (dalam Panjang x Lebar x Tinggi) <FiHelpCircle style={{ color: '#cbd5e1' }} />
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input type="number" name="volumeP" className={`${styles.input} ${errors.includes('volumeP') ? styles.inputError : ''}`} value={formData.volumeP} onChange={handleInputChange} style={{ textAlign: 'center', width: '90px', padding: '0.6rem' }} />
                          <input type="number" name="volumeL" className={`${styles.input} ${errors.includes('volumeL') ? styles.inputError : ''}`} value={formData.volumeL} onChange={handleInputChange} style={{ textAlign: 'center', width: '90px', padding: '0.6rem' }} />
                          <input type="number" name="volumeT" className={`${styles.input} ${errors.includes('volumeT') ? styles.inputError : ''}`} value={formData.volumeT} onChange={handleInputChange} style={{ textAlign: 'center', width: '90px', padding: '0.6rem' }} />
                          <span style={{ fontWeight: 600, color: '#94a3b8', fontSize: '0.9rem' }}>cm</span>
                        </div>
                        {(errors.includes('volumeP') || errors.includes('volumeL') || errors.includes('volumeT')) && <p className={styles.errorText}>*Mohon lengkapi data</p>}
                      </div>
                      <div>
                        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          Berat <FiHelpCircle style={{ color: '#cbd5e1' }} />
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input type="number" name="weight" className={styles.input} value={formData.weight} onChange={handleInputChange} />
                          <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#94a3b8', fontSize: '0.9rem' }}>gram</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.twoColumnRow}>
                  <div className={styles.leftCol}>Ubah Harga Jual</div>
                  <div className={styles.rightCol}>
                    <div className={styles.toggleSection} style={{ marginBottom: '1rem' }}>
                      <div 
                        className={`${styles.toggle} ${canChangePrice ? styles.toggleActive : ''}`}
                        onClick={() => setCanChangePrice(!canChangePrice)}
                      >
                        <div className={styles.toggleCircle}></div>
                        <span className={styles.toggleOnText}>ON</span>
                        <span className={styles.toggleOffText}>OFF</span>
                      </div>
                      <span style={{ fontWeight: 500, color: '#475569', fontSize: '0.9rem' }}>Izinkan kasir untuk mengubah harga jual</span>
                    </div>
                    <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', width: '100%' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>Maks.</span>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#94a3b8' }}>0%</span>
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FiHelpCircle /> Pastikan harga jual lebih tinggi dari harga beli
                    </p>
                  </div>
                </div>
              </section>
            </>
          ) : currentStep === 'varian' ? (
            <>
              {/* Varian Produk Step */}
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Varian Produk</h2>

                <div className={styles.variantSection}>
                  <div className={styles.twoColumnRow}>
                    <div className={styles.leftCol}>Produk Memiliki Varian</div>
                    <div className={styles.rightCol}>
                      <div className={styles.toggleSection}>
                        <div
                          className={`${styles.toggle} ${hasVariants ? styles.toggleActive : ''}`}
                          onClick={handleToggleVariants}
                        >
                          <div className={styles.toggleCircle}></div>
                          <span className={styles.toggleOnText}>ON</span>
                          <span className={styles.toggleOffText}>OFF</span>
                        </div>
                        <span style={{ fontWeight: 500, color: '#64748b', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                          Aktifkan untuk menambahkan pilihan variasi produk
                        </span>
                      </div>
                    </div>
                  </div>

                  {hasVariants && (
                    <div className={styles.variantSection}>
                      {variantGroups.map((group, groupIndex) => (
                        <React.Fragment key={group.id}>
                          <div className={styles.twoColumnRow}>
                            <div className={styles.leftCol}>{groupIndex === 0 ? 'Tipe Varian' : ''}</div>
                            <div className={styles.rightCol}>
                              <div className={styles.inputWithIcon} style={{ marginBottom: '1.25rem' }}>
                                <div style={{ flex: 1 }}>
                                  <div className={styles.inputHeader}>
                                    <label className={styles.label} style={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}>Nama Varian</label>
                                    <span className={styles.charCount}>{group.name.length}/14</span>
                                  </div>
                                  <input
                                    type="text"
                                    className={`${styles.input} ${group.name ? styles.inputActive : ''}`}
                                    placeholder="Contoh: Warna, Rasa, dll."
                                    value={group.name}
                                    onChange={(e) => handleGroupChange(group.id, 'name', e.target.value)}
                                  />
                                </div>
                                <FiTrash2 className={styles.trashBtn} style={{ marginBottom: '8px' }} onClick={() => handleDeleteVariantGroup(group.id)} />
                              </div>

                              <div className={styles.optionsGrid}>
                                {group.options.map((option, optionIndex) => (
                                  <div key={option.id} className={styles.pilihanVarianRow}>
                                    <div className={styles.inputWrapper}>
                                      <div className={styles.inputHeader}>
                                        <label className={styles.label} style={{ textTransform: 'none', fontWeight: 600, fontSize: '0.85rem' }}>Pilihan Varian {optionIndex + 1}</label>
                                        <span className={styles.charCount}>{option.value.length}/30</span>
                                      </div>
                                      <input
                                        type="text"
                                        className={`${styles.input} ${option.value ? styles.inputActive : ''}`}
                                        placeholder="Contoh: Vanila, Putih, dll."
                                        value={option.value}
                                        onChange={(e) => handleOptionValueChange(group.id, option.id, e.target.value)}
                                      />
                                    </div>
                                    {optionIndex === group.options.length - 1 ? (
                                      <span className={styles.addOptionBtn} onClick={() => handleAddOption(group.id)} style={{ marginBottom: '8px', whiteSpace: 'nowrap' }}>Tambah Pilihan Varian</span>
                                    ) : (
                                      <FiTrash2 className={styles.trashBtn} style={{ marginBottom: '8px' }} onClick={() => handleDeleteOption(group.id, option.id)} />
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {groupIndex < variantGroups.length - 1 && <div className={styles.groupDivider}></div>}
                        </React.Fragment>
                      ))}

                      {variantGroups.length < 3 && (
                        <div className={styles.twoColumnRow} style={{ marginTop: '1.5rem' }}>
                          <div className={styles.leftCol}></div>
                          <div className={styles.rightCol}>
                            <button className={styles.addVariantBtn} onClick={handleAddVariantGroup}>Tambah Varian</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {hasVariants && (
                  <>
                    <div className={styles.divider}></div>

                    <div className={styles.section}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Daftar Varian</h3>
                      <p style={{ margin: '4px 0 1.5rem 0', fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                        Perubahan yang akan dilakukan akan mempengaruhi data varian pada
                      </p>

                      <div className={styles.tableHeaderRow}>
                        <div className={styles.tableHeaderItem}>PILIHAN VARIAN</div>
                        <div className={styles.tableHeaderItem}>HARGA BELI</div>
                        <div className={styles.tableHeaderItem}>HARGA JUAL</div>
                        <div className={styles.tableHeaderItem}>SKU</div>
                        <div className={styles.tableHeaderItem}>TAMPIL DI MENU</div>
                      </div>

                      <>
                        {combinations.length > 0 ? combinations.map((option, index) => (
                          <div key={index} className={styles.tableRow}>
                            <div className={styles.variantNameText} style={{ fontSize: '0.85rem' }}>{option.name}</div>
                            <div className={styles.tableInputWrapper}>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={`Rp ${option.buyPrice}`}
                                disabled
                                readOnly
                              />
                            </div>
                            <div className={styles.tableInputWrapper}>
                              <input
                                type="text"
                                className={styles.tableInput}
                                value={`Rp ${option.salePrice}`}
                                onChange={(e) => {
                                  const formatted = formatRupiah(e.target.value);
                                  setCombinationsData(prev => {
                                    const next = [...prev];
                                    next[index] = { ...next[index], salePrice: formatted };
                                    return next;
                                  });
                                }}
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <input
                                type="text"
                                className={styles.skuInput}
                                placeholder=""
                                value={option.sku}
                                onChange={(e) => {
                                  setSkuErrors(prev => prev.filter(i => i !== index));
                                  setCombinationsData(prev => {
                                    const next = [...prev];
                                    next[index] = { ...next[index], sku: e.target.value };
                                    return next;
                                  });
                                }}
                                style={{
                                  fontSize: '0.85rem',
                                  borderColor: skuErrors.includes(index) ? '#ef4444' : undefined,
                                  background: skuErrors.includes(index) ? '#fef2f2' : undefined,
                                }}
                              />
                              {skuErrors.includes(index) && (
                                <p style={{ color: '#ef4444', fontSize: '0.72rem', margin: 0, fontWeight: 500 }}>*Mohon lengkapi SKU</p>
                              )}
                            </div>
                              <div className={styles.toggleSection} style={{ justifyContent: 'center' }}>
                                <div
                                  className={`${styles.toggle} ${option.showInMenu ? styles.toggleActive : ''}`}
                                  onClick={() => {
                                    setCombinationsData(prev => {
                                      const next = [...prev];
                                      next[index] = { ...next[index], showInMenu: !next[index].showInMenu };
                                      return next;
                                    });
                                  }}
                                >
                                  <div className={styles.toggleCircle}></div>
                                  <span className={styles.toggleOnText}>ON</span>
                                  <span className={styles.toggleOffText}>OFF</span>
                                </div>
                              </div>
                          </div>
                        )) : (
                          <div className={styles.emptyState}>
                            <h4 className={styles.emptyTitle}>Data tidak tersedia</h4>
                            <p className={styles.emptySub}>Belum ada data yang dapat ditampilkan di halaman ini</p>
                          </div>
                        )}
                      </>
                    </div>
                  </>
                )}
              </section>
            </>
          ) : currentStep === 'ekstra' ? (
            <>
              <section className={styles.section}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Ekstra</h2>

                  {/* Produk Memiliki Ekstra */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', minWidth: '180px' }}>Produk Memiliki Ekstra</span>
                    <div
                      className={`${styles.toggle} ${hasExtra ? styles.toggleActive : ''}`}
                      style={{ background: hasExtra ? '#ff6b00' : undefined }}
                      onClick={() => { setHasExtra(p => !p); if (hasExtra) { setCanEditExtra(false); setSelectedExtra(''); setExtraDropdownError(false); } }}
                    >
                      <div className={styles.toggleCircle}></div>
                      <span className={styles.toggleOnText}>ON</span>
                      <span className={styles.toggleOffText}>OFF</span>
                    </div>
                    <div className={styles.tooltipContainer}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 700, cursor: 'help' }}>i</div>
                      <span className={styles.tooltipText}>Mengubah data Ekstra pada produk ini tidak mempengaruhi pengaturan awal data Ekstra</span>
                    </div>
                  </div>

                  {/* Ubah Data Ekstra — hanya tampil jika hasExtra ON */}
                  {hasExtra && (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', minWidth: '180px' }}>Ubah Data Ekstra</span>
                        <div
                          className={`${styles.toggle} ${canEditExtra ? styles.toggleActive : ''}`}
                          style={{ background: canEditExtra ? '#ff6b00' : undefined }}
                          onClick={() => setCanEditExtra(p => !p)}
                        >
                          <div className={styles.toggleCircle}></div>
                          <span className={styles.toggleOnText}>ON</span>
                          <span className={styles.toggleOffText}>OFF</span>
                        </div>
                        <div className={styles.tooltipContainer}>
                          <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.7rem', fontWeight: 700, cursor: 'help' }}>i</div>
                          <span className={styles.tooltipText}>Berfungsi untuk mengubah data ekstra (takaran* dan harga jual) dan tidak mengubah takaran* dan harga jual master ekstra. Apabila dinonaktifkan maka data ekstra akan kembali sesuai pengaturan master ekstra</span>
                        </div>
                      </div>

                      {/* Atur Ekstra */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', minWidth: '180px', paddingTop: '1.5rem' }}>Atur Ekstra</span>
                        <div style={{ flex: 1 }}>
                          
                          {/* Add New Extra Selector (Now at the top) */}
                          <div style={{ marginBottom: '2rem' }}>
                            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Nama Ekstra</label>
                            <div style={{ position: 'relative' }}>
                              <div
                                onClick={() => { setShowExtraDropdown(p => !p); setExtraDropdownError(false); }}
                                style={{
                                  width: '100%', padding: '0.75rem 1rem', border: `1px solid ${extraDropdownError ? '#ef4444' : '#e2e8f0'}`,
                                  background: extraDropdownError ? '#fef2f2' : 'white',
                                  borderRadius: '10px', display: 'flex', justifyContent: 'space-between',
                                  alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem',
                                  color: selectedExtra ? '#0f172a' : '#94a3b8'
                                }}
                              >
                                <span>{selectedExtra || 'Pilih Ekstra'}</span>
                                <FiChevronDown style={{ transition: 'transform 0.2s', transform: showExtraDropdown ? 'rotate(180deg)' : 'rotate(0)' }} />
                              </div>
                              {showExtraDropdown && (
                                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', zIndex: 50, boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '0.5rem 0' }}>
                                  {masterExtras.map(extra => (
                                    <div
                                      key={extra.name}
                                      onClick={() => { 
                                        setSelectedExtra(extra.name); 
                                        setShowExtraDropdown(false); 
                                        setExtraDropdownError(false);
                                        // Update activeExtraData
                                        setActiveExtraData(JSON.parse(JSON.stringify(extra)));
                                      }}
                                      style={{ padding: '0.75rem 1.25rem', cursor: 'pointer', fontSize: '0.9rem', color: '#0f172a' }}
                                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >{extra.name}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {extraDropdownError && (
                              <p style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500, margin: '0.35rem 0 0 0' }}>*Belum Memilih Ekstra</p>
                            )}
                          </div>

                          {/* Render Active Extra Options */}
                          {activeExtraData && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                              {activeExtraData.options.map((opt, optIdx) => (
                                <div key={optIdx} style={{ paddingBottom: '2.5rem', borderBottom: optIdx < activeExtraData.options.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                  
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                    <div>
                                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Nama Pilihan Ekstra</label>
                                      <input 
                                        type="text" 
                                        className={styles.input} 
                                        value={opt.name}
                                        readOnly={!canEditExtra}
                                        style={{ background: canEditExtra ? 'white' : '#f8fafc', marginTop: 0 }}
                                        onChange={(e) => {
                                          if (!canEditExtra) return;
                                          const newData = { ...activeExtraData };
                                          newData.options[optIdx].name = e.target.value;
                                          setActiveExtraData(newData);
                                        }}
                                      />
                                    </div>
                                    <div>
                                      <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Harga Jual</label>
                                      <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#475569', fontSize: '0.9rem' }}>Rp.</span>
                                        <input 
                                          type="text" 
                                          className={styles.input} 
                                          value={opt.price}
                                          readOnly={!canEditExtra}
                                          style={{ background: canEditExtra ? 'white' : '#f8fafc', paddingLeft: '3.5rem', marginTop: 0 }}
                                          onChange={(e) => {
                                            if (!canEditExtra) return;
                                            const newData = { ...activeExtraData };
                                            newData.options[optIdx].price = e.target.value;
                                            setActiveExtraData(newData);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Bahan Baku Section */}
                                  <div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0' }}>Bahan Baku</h4>
                                    
                                    <div style={{ background: '#f8fafc', borderRadius: '4px', overflow: 'hidden' }}>
                                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr', padding: '1rem 1.25rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Nama Bahan Baku</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Harga Modal</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Takaran</div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Satuan</div>
                                      </div>
                                      
                                      {opt.ingredients.map((ing, ingIdx) => (
                                        <div key={ingIdx} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1.5fr', gap: '1rem', padding: '1.25rem', alignItems: 'center', background: 'white' }}>
                                          <input 
                                            type="text" 
                                            className={styles.input} 
                                            value={ing.name}
                                            readOnly={!canEditExtra}
                                            style={{ background: canEditExtra ? 'white' : '#f8fafc', marginTop: 0 }}
                                            onChange={(e) => {
                                              if (!canEditExtra) return;
                                              const newData = { ...activeExtraData };
                                              newData.options[optIdx].ingredients[ingIdx].name = e.target.value;
                                              setActiveExtraData(newData);
                                            }}
                                          />
                                          <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}>Rp</span>
                                            <input 
                                              type="text" 
                                              className={styles.input} 
                                              value={ing.cost}
                                              readOnly={!canEditExtra}
                                              style={{ background: canEditExtra ? 'white' : '#f8fafc', paddingLeft: '2.25rem', marginTop: 0 }}
                                              onChange={(e) => {
                                                if (!canEditExtra) return;
                                                const newData = { ...activeExtraData };
                                                newData.options[optIdx].ingredients[ingIdx].cost = e.target.value;
                                                setActiveExtraData(newData);
                                              }}
                                            />
                                          </div>
                                          <input 
                                            type="text" 
                                            className={styles.input} 
                                            value={ing.amount}
                                            readOnly={!canEditExtra}
                                            style={{ background: canEditExtra ? 'white' : '#f8fafc', marginTop: 0 }}
                                            onChange={(e) => {
                                              if (!canEditExtra) return;
                                              const newData = { ...activeExtraData };
                                              newData.options[optIdx].ingredients[ingIdx].amount = e.target.value;
                                              setActiveExtraData(newData);
                                            }}
                                          />
                                          <input 
                                            type="text" 
                                            className={styles.input} 
                                            value={ing.unit}
                                            readOnly={!canEditExtra}
                                            style={{ background: canEditExtra ? 'white' : '#f8fafc', marginTop: 0 }}
                                            onChange={(e) => {
                                              if (!canEditExtra) return;
                                              const newData = { ...activeExtraData };
                                              newData.options[optIdx].ingredients[ingIdx].unit = e.target.value;
                                              setActiveExtraData(newData);
                                            }}
                                          />
                                        </div>
                                      ))}
                                      {opt.ingredients.length === 0 && (
                                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem', background: 'white' }}>Tidak ada bahan baku</div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>
            </>
          ) : currentStep === 'resep' ? (
            <>
              <section className={styles.section}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>Resep</h2>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', minWidth: '180px' }}>Resep Produk</span>
                    <div
                      className={`${styles.toggle} ${hasRecipe ? styles.toggleActive : ''}`}
                      style={{ background: hasRecipe ? '#ff6b00' : undefined }}
                      onClick={() => setHasRecipe(p => !p)}
                    >
                      <div className={styles.toggleCircle}></div>
                      <span className={styles.toggleOnText}>ON</span>
                      <span className={styles.toggleOffText}>OFF</span>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Aktifkan untuk menambahkan resep pada produk</span>
                  </div>

                  {hasRecipe && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '1.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', minWidth: '180px', paddingTop: '0.5rem' }}>
                        Pengaturan Resep<br/>Produk
                      </span>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
                        
                        <div 
                          onClick={() => setRecipeType('manual')}
                          style={{ 
                            border: `1.5px solid ${recipeType === 'manual' ? '#ff6b00' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            padding: '1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start',
                            background: recipeType === 'manual' ? '#fffaf5' : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ 
                            width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${recipeType === 'manual' ? '#ff6b00' : '#cbd5e1'}`, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                          }}>
                            {recipeType === 'manual' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff6b00' }}></div>}
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Resep Manual Bahan Baku</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>Pada resep manual bahan baku, Anda akan dapat menentukan sendiri resep dengan bahan baku yang ada</p>
                          </div>
                        </div>

                        <div 
                          onClick={() => setRecipeType('master')}
                          style={{ 
                            border: `1.5px solid ${recipeType === 'master' ? '#ff6b00' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            padding: '1.25rem',
                            cursor: 'pointer',
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'flex-start',
                            background: recipeType === 'master' ? '#fffaf5' : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ 
                            width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${recipeType === 'master' ? '#ff6b00' : '#cbd5e1'}`, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px'
                          }}>
                            {recipeType === 'master' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff6b00' }}></div>}
                          </div>
                          <div>
                            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Resep Menggunakan Master Resep</h4>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>Pada resep menggunakan master resep, Anda akan dapat memilih resep yang sudah tersedia pada master resep</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {hasRecipe && recipeType === 'master' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', minWidth: '180px' }}>
                        Pilih Master Resep
                      </span>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <div
                          onClick={() => { setShowMasterRecipeModal(true); setDraftMasterRecipe(selectedMasterRecipe); }}
                          style={{
                            width: '100%', padding: '0.85rem 1rem', border: '1px solid #e2e8f0',
                            background: 'white',
                            borderRadius: '10px', display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', cursor: 'pointer', fontSize: '0.9rem',
                            color: selectedMasterRecipe ? '#0f172a' : '#94a3b8'
                          }}
                        >
                          <span>{selectedMasterRecipe ? masterRecipesData.find(r => r.id === selectedMasterRecipe)?.name || 'Pilih' : 'Pilih'}</span>
                          <FiChevronDown style={{ transition: 'transform 0.2s', transform: 'rotate(0)', color: '#94a3b8' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  {hasRecipe && recipeType === 'master' && selectedMasterRecipe && (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginTop: '2rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a', minWidth: '180px', paddingTop: '0.5rem' }}>Bahan Baku</span>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {masterRecipesData.find(r => r.id === selectedMasterRecipe)?.ingredients.map((ing, idx) => (
                          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: 'white', paddingBottom: idx < (masterRecipesData.find(r => r.id === selectedMasterRecipe)?.ingredients.length || 0) - 1 ? '1.5rem' : 0, borderBottom: idx < (masterRecipesData.find(r => r.id === selectedMasterRecipe)?.ingredients.length || 0) - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Bahan Baku</label>
                              <div style={{ width: '100%', padding: '0.85rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#94a3b8', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{ing.name}</span>
                                <FiChevronDown />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Harga Modal</label>
                              <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 600, color: '#94a3b8', fontSize: '0.9rem' }}>Rp</span>
                                <input type="text" className={styles.input} value={ing.cost} readOnly disabled style={{ background: '#f8fafc', paddingLeft: '2.5rem', marginTop: 0, color: '#94a3b8' }} />
                              </div>
                            </div>
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Takaran</label>
                              <input type="text" className={styles.input} value={ing.amount} readOnly disabled style={{ background: '#f8fafc', marginTop: 0, color: '#94a3b8' }} />
                            </div>
                            <div>
                              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.5rem' }}>Satuan</label>
                              <input type="text" className={styles.input} value={ing.unit} readOnly disabled style={{ background: '#f8fafc', marginTop: 0, color: '#94a3b8' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </section>
            </>
          ) : null}
          {/* end ekstra - varian fallthrough below */}

        </div>

      </div>

      {/* Bottom Action Bar */}
      <footer className={styles.bottomBar}>
        <div className={styles.bottomBarContent}>
          {currentStep === 'review' ? (
            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end', alignItems: 'center', gap: '2rem' }}>
              <div 
                className={styles.btnText} 
                style={{ color: '#ff6b00', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setCurrentStep('informasi')}
              >
                Kembali
              </div>
              <button 
                className={`${styles.saveBtn} ${isFormValid ? styles.saveBtnActive : ''}`}
                disabled={!isFormValid}
                ref={tourRefs.save}
                onClick={handleSave}
                style={{ 
                  background: '#ff6b00', 
                  border: 'none', 
                  color: 'white', 
                  padding: '0.6rem 2rem', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  cursor: 'pointer'
                }}
              >
                Simpan
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {currentStep === 'resep' && (
                  <div style={{ border: '1px solid #ef4444', borderRadius: '8px', padding: '0.5rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', height: '42px' }}>
                    <FiTrash2 style={{ color: '#ef4444', fontSize: '1.2rem' }} />
                  </div>
                )}
                <div className={styles.cancelBtnText} onClick={() => setShowCancelConfirmModal(true)}>
                  Batal
                </div>
              </div>
              <div className={styles.actionBtns}>
                {currentStep !== 'informasi' && (
                  <div className={styles.btnText} onClick={() => {
                    if (currentStep === 'varian') setCurrentStep('informasi');
                    else if (currentStep === 'ekstra') setCurrentStep('varian');
                    else if (currentStep === 'resep') setCurrentStep('ekstra');
                    else if (currentStep === 'review') setCurrentStep('resep');
                    else setCurrentStep('informasi');
                  }}>Kembali</div>
                )}
                <div className={styles.btnText} onClick={handleNext}>Selanjutnya</div>
                <button 
                  className={styles.btnSimpan} 
                  onClick={handleSave}
                >
                  Simpan
                </button>
              </div>
            </>
          )}
        </div>
      </footer>

      {/* Variant Modal */}
      {showVariantModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h3>Varian</h3>
              <FiX className={styles.modalClose} onClick={() => setShowVariantModal(false)} />
            </div>
            <div className={styles.modalContent}>
              <ul>
                <li>Multi Satuan, Harga Grosir tidak dapat digunakan jika Varian diaktifkan.</li>
                <li>Harga dan SKU pada step <b>Informasi Produk</b> akan disesuaikan seperti pada step <b>Varian</b></li>
              </ul>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalCancelBtn} onClick={() => setShowVariantModal(false)}>Batal</button>
              <button className={styles.modalSaveBtn} onClick={confirmVariants}>Simpan</button>
            </div>
          </div>
        </div>
      )}
      {/* Error Toast (Top Right) */}
      {showToast && (
        <div className={styles.toastNotification}>
          <div className={styles.toastContent}>
            <h4 className={styles.toastTitle}>Terjadi Kesalahan</h4>
            <p className={styles.toastDescription}>File image terlalu besar (max: 1 MB)</p>
          </div>
          <button className={styles.toastClose} onClick={() => setShowToast(false)}>
            <FiX />
          </button>
        </div>
      )}

      {/* Potong Gambar Modal */}
      {showCropModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.cropModal}>
            <div className={styles.cropHeader}>
              <h3>Potong Gambar</h3>
              <FiX 
                style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem' }} 
                onClick={() => setShowCropModal(false)} 
              />
            </div>
            <div className={styles.cropBody}>
              <div className={styles.cropImageContainer}>
                {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Crop Preview" 
                    className={styles.cropPreview} 
                    style={{ 
                      transform: `rotate(${rotation}deg) scaleX(${isMirrored ? -1 : 1})`, 
                      transition: 'transform 0.3s ease' 
                    }}
                  />
                )}
                {/* Interactive Crop Box */}
                <div 
                  className={styles.cropBox}
                  style={{
                    top: `${cropBox.y}%`,
                    left: `${cropBox.x}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`,
                  }}
                  onMouseDown={(e) => handleCropStart(e, 'move')}
                >
                  <div className={`${styles.cropHandle} ${styles.handleTL}`} onMouseDown={(e) => { e.stopPropagation(); handleCropStart(e, 'nw'); }}></div>
                  <div className={`${styles.cropHandle} ${styles.handleTR}`} onMouseDown={(e) => { e.stopPropagation(); handleCropStart(e, 'ne'); }}></div>
                  <div className={`${styles.cropHandle} ${styles.handleBL}`} onMouseDown={(e) => { e.stopPropagation(); handleCropStart(e, 'sw'); }}></div>
                  <div className={`${styles.cropHandle} ${styles.handleBR}`} onMouseDown={(e) => { e.stopPropagation(); handleCropStart(e, 'se'); }}></div>
                </div>
              </div>
            </div>
            <div className={styles.cropFooter}>
              <div style={{ display: 'flex', gap: '0.5rem', marginRight: 'auto' }}>
                <button 
                  className={styles.btnRotate} 
                  onClick={() => setRotation(prev => prev - 90)}
                  title="Putar Kiri"
                >
                  <FiRotateCcw />
                </button>
                <button 
                  className={styles.btnRotate} 
                  onClick={() => setRotation(prev => prev + 90)}
                  title="Putar Kanan"
                >
                  <FiRotateCw />
                </button>
                <button 
                  className={styles.btnRotate} 
                  onClick={() => setIsMirrored(prev => !prev)}
                  title="Mirror"
                >
                  <FiMaximize2 style={{ transform: 'rotate(45deg)' }} />
                </button>
              </div>
              <button className={styles.btnBatal} onClick={() => setShowCropModal(false)}>Batal</button>
              <button className={styles.btnSimpan} onClick={async () => {
                if (previewUrl) {
                  const croppedUrl = await getCroppedImg(previewUrl, cropBox, rotation, isMirrored);
                  if (replacingIndex !== null) {
                    setSavedImages(prev => {
                      const next = [...prev];
                      next[replacingIndex] = croppedUrl;
                      return next;
                    });
                    setReplacingIndex(null);
                  } else {
                    setSavedImages(prev => [...prev, croppedUrl]);
                  }
                  setShowCropModal(false);
                }
              }}>Simpan</button>
            </div>
          </div>
        </div>
      )}
      {/* Pratinjau Gambar Modal */}
      {showPreviewModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPreviewModal(false)}>
          <div className={styles.cropModal} style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div className={styles.cropHeader}>
              <h3>Pratinjau Gambar</h3>
              <FiX 
                style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem' }} 
                onClick={() => setShowPreviewModal(false)} 
              />
            </div>
            <div className={styles.cropBody} style={{ padding: '1rem' }}>
              <div className={styles.imageWrapper} style={{ width: '100%', height: 'auto', borderRadius: '8px' }}>
                <img src={currentPreviewImg || ''} alt="Preview Full" style={{ width: '100%', height: 'auto' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirmModal && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 9999, display: 'flex', alignItems: 'center',
            justifyContent: 'center', backdropFilter: 'blur(2px)'
          }}
        >
          <div
            style={{
              background: 'white', borderRadius: '16px', padding: '2rem',
              width: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Batal Tambahkan Produk</h3>
              <FiX
                style={{ cursor: 'pointer', color: '#94a3b8', fontSize: '1.2rem', flexShrink: 0 }}
                onClick={() => setShowCancelConfirmModal(false)}
              />
            </div>
            <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
              Membatalkan <strong style={{ color: '#0f172a' }}>Tambah Produk</strong> akan menghapus seluruh
              data yang telah diinput dan tidak dapat dibatalkan. Lanjutkan?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                onClick={() => setShowCancelConfirmModal(false)}
                style={{
                  background: 'transparent', border: 'none', color: '#64748b',
                  fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', padding: '0.6rem 1.25rem'
                }}
              >
                Kembali
              </button>
              <button
                onClick={() => router.back()}
                style={{
                  background: '#ef4444', border: 'none', color: 'white',
                  fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                  padding: '0.65rem 1.75rem', borderRadius: '10px'
                }}
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tambah Kategori Full Screen View */}
      {showAddCategory && (
          <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', zIndex: 2000, display: 'flex', flexDirection: 'column' }}>
            {/* Top Bar */}
            <header style={{ height: '70px', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', padding: '0 2rem', position: 'relative' }}>
              <FiX 
                style={{ fontSize: '1.5rem', color: '#64748b', cursor: 'pointer' }} 
                onClick={() => setShowAddCategory(false)} 
              />
              <h1 style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                Tambah Kategori
              </h1>
            </header>

            {/* Content */}
            <main style={{ flex: 1, overflowY: 'auto', padding: '3rem 0' }}>
              <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '32px', padding: '3rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '2.5rem', color: '#000' }}>Informasi Kategori</h2>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Atur Outlet */}
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                      <div style={{ width: '220px', fontSize: '1rem', fontWeight: 600, color: '#000', marginTop: '0.75rem' }}>Atur Outlet <span style={{ color: '#ef4444' }}>*</span></div>
                      <div style={{ flex: 1, position: 'relative' }} ref={dropdownRef}>
                        <div 
                          onClick={() => setIsOutletDropdownOpen(!isOutletDropdownOpen)}
                          style={{ 
                            width: '100%', 
                            padding: '0.75rem 1rem', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            color: '#0f172a',
                            cursor: 'pointer',
                            background: 'white'
                          }}
                        >
                          <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{selectedOutlets.length} Outlet Terpilih</span>
                          <FiChevronDown style={{ transform: isOutletDropdownOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s', color: '#94a3b8' }} />
                        </div>

                        {isOutletDropdownOpen && (
                          <div style={{ 
                            position: 'absolute', 
                            top: 'calc(100% + 8px)', 
                            left: 0, 
                            right: 0, 
                            background: 'white', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '16px', 
                            zIndex: 10,
                            overflow: 'hidden',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                          }}>
                            {/* Pilih Semua */}
                            <div 
                              onClick={() => {
                                if (selectedOutlets.length === 1) setSelectedOutlets([]);
                                else setSelectedOutlets(['Kedai Laras']);
                              }}
                              style={{ 
                                padding: '1rem', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                cursor: 'pointer',
                                borderBottom: '1px solid #f1f5f9'
                              }}
                            >
                              <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>Pilih Semua</span>
                              <div style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '6px', 
                                background: selectedOutlets.length === 1 ? '#ff6b00' : 'transparent',
                                border: selectedOutlets.length === 1 ? 'none' : '2px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}>
                                {selectedOutlets.length === 1 && <FiCheck strokeWidth={4} />}
                              </div>
                            </div>
                            {/* Kedai Laras */}
                            <div 
                              onClick={() => {
                                if (selectedOutlets.includes('Kedai Laras')) setSelectedOutlets([]);
                                else setSelectedOutlets(['Kedai Laras']);
                              }}
                              style={{ 
                                padding: '1rem', 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                cursor: 'pointer'
                              }}
                            >
                              <span style={{ fontSize: '1rem', color: '#0f172a', fontWeight: 500 }}>Kedai Laras</span>
                              <div style={{ 
                                width: '22px', 
                                height: '22px', 
                                borderRadius: '6px', 
                                background: selectedOutlets.includes('Kedai Laras') ? '#ff6b00' : 'transparent',
                                border: selectedOutlets.includes('Kedai Laras') ? 'none' : '2px solid #e2e8f0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}>
                                {selectedOutlets.includes('Kedai Laras') && <FiCheck strokeWidth={4} />}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Nama Kategori */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '220px', fontSize: '1rem', fontWeight: 600, color: '#000' }}>Nama Kategori <span style={{ color: '#ef4444' }}>*</span></div>
                      <div style={{ flex: 1 }}>
                        <input 
                          type="text" 
                          placeholder="Contoh: Cemilan" 
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                          value={categoryFormData.name}
                          onChange={(e) => setCategoryFormData({...categoryFormData, name: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Urutan Tampilan */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '220px', fontSize: '1rem', fontWeight: 600, color: '#000' }}>Urutan Tampilan <span style={{ color: '#ef4444' }}>*</span></div>
                      <div style={{ flex: 1 }}>
                        <input 
                          type="text" 
                          placeholder="Contoh: 1" 
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', outline: 'none' }}
                          value={categoryFormData.order}
                          onChange={(e) => setCategoryFormData({...categoryFormData, order: e.target.value})}
                        />
                      </div>
                    </div>

                    {/* Departemen */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '220px', fontSize: '1rem', fontWeight: 600, color: '#000' }}>Departemen</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94a3b8' }}>
                          <span>Pilih ...</span>
                          <FiChevronDown />
                        </div>
                      </div>
                    </div>

                    {/* Tampil di Menu */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{ width: '220px', fontSize: '1rem', fontWeight: 600, color: '#000' }}>Tampil di Menu</div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div 
                          onClick={() => setCategoryFormData({...categoryFormData, showInMenu: !categoryFormData.showInMenu})}
                          style={{ 
                            width: '50px', 
                            height: '24px', 
                            background: categoryFormData.showInMenu ? '#ff6b00' : '#cbd5e1', 
                            borderRadius: '20px', 
                            position: 'relative', 
                            cursor: 'pointer',
                            transition: 'background 0.3s'
                          }}
                        >
                          <div style={{ 
                            width: '18px', 
                            height: '18px', 
                            background: 'white', 
                            borderRadius: '50%', 
                            position: 'absolute', 
                            top: '3px', 
                            left: categoryFormData.showInMenu ? '29px' : '3px',
                            transition: 'left 0.3s'
                          }} />
                          <span style={{ position: 'absolute', right: categoryFormData.showInMenu ? 'auto' : '6px', left: categoryFormData.showInMenu ? '6px' : 'auto', top: '50%', transform: 'translateY(-50%)', fontSize: '0.6rem', fontWeight: 800, color: 'white' }}>
                            {categoryFormData.showInMenu ? 'ON' : 'OFF'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Tampilkan kategori pada aplikasi kasir</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>

            {/* Bottom Bar */}
            <footer style={{ height: '80px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
              <button 
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontWeight: 700, fontSize: '1rem', padding: '0.6rem 2rem', cursor: 'pointer' }}
                onClick={() => setShowAddCategory(false)}
              >
                BATAL
              </button>
              <button 
                style={{ 
                  background: (selectedOutlets.length > 0 && categoryFormData.name.trim() && categoryFormData.order.trim()) ? '#ff6b00' : '#fed7aa', 
                  border: 'none', 
                  color: 'white', 
                  padding: '0.75rem 4rem', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  fontSize: '1rem', 
                  cursor: (selectedOutlets.length > 0 && categoryFormData.name.trim() && categoryFormData.order.trim()) ? 'pointer' : 'not-allowed',
                  opacity: 1,
                  transition: 'background 0.2s'
                }}
                disabled={!(selectedOutlets.length > 0 && categoryFormData.name.trim() && categoryFormData.order.trim())}
                onClick={() => {
                  if (categoryFormData.name) {
                    setCategories([...categories, categoryFormData.name]);
                    setFormData({...formData, category: categoryFormData.name});
                    setShowAddCategory(false);
                    // Reset form
                    setCategoryFormData({
                      outlets: 'Kedai Laras',
                      name: '',
                      order: '',
                      department: '',
                      showInMenu: false
                    });
                  }
                }}
              >
                SIMPAN
              </button>
            </footer>
          </div>
      )}

      {/* Master Recipe Selection Modal */}
      {showMasterRecipeModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} style={{ width: '800px', maxWidth: '90vw' }}>
            <div className={styles.modalHeader} style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>Pilih Resep</h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Pilih resep yang akan dijadikan acuan</p>
              </div>
              <FiX className={styles.modalClose} onClick={() => setShowMasterRecipeModal(false)} />
            </div>
            <div className={styles.modalContent} style={{ paddingTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem 1rem', width: '300px', marginBottom: '2rem' }}>
                <FiSearch style={{ color: '#94a3b8', marginRight: '0.75rem', fontSize: '1.1rem' }} />
                <input type="text" placeholder="Cari ..." style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.9rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr', padding: '1rem', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '8px 8px 0 0' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Kode Master Resep <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}><FiChevronUp style={{ fontSize: '0.6rem' }}/><FiChevronDown style={{ fontSize: '0.6rem' }}/></span></div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>Nama Master Resep</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>Jumlah Bahan</div>
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {masterRecipesData.map(recipe => (
                  <div key={recipe.id} style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr', padding: '1.25rem 1rem', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div 
                        onClick={() => setDraftMasterRecipe(recipe.id)}
                        style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${draftMasterRecipe === recipe.id ? '#ff6b00' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        {draftMasterRecipe === recipe.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff6b00' }}></div>}
                      </div>
                      <span style={{ fontSize: '0.9rem', color: '#475569' }}>{recipe.id}</span>
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#475569' }}>{recipe.name}</div>
                    <div>
                      <span style={{ background: '#ecfdf5', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{recipe.ingredients.length} Bahan Baku</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter} style={{ borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: '1rem', paddingTop: '1.5rem', marginTop: '1rem' }}>
              <div 
                style={{ color: '#ff6b00', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem 1rem' }}
                onClick={() => setShowMasterRecipeModal(false)}
              >
                Batal
              </div>
              <button 
                style={{ opacity: draftMasterRecipe ? 1 : 0.5, cursor: draftMasterRecipe ? 'pointer' : 'not-allowed', background: '#ff6b00', color: 'white', border: 'none', padding: '0.6rem 2rem', borderRadius: '8px', fontWeight: 700 }}
                disabled={!draftMasterRecipe}
                onClick={() => {
                  setSelectedMasterRecipe(draftMasterRecipe);
                  setShowMasterRecipeModal(false);
                }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Tour UI */}
      {showTour && tourStep > 0 && (
        <>
          <div className={styles.tourOverlay} />
          <div 
            className={styles.tourPopover}
            style={{
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
            }}
          >
            <div className={`${styles.tourArrow} ${styles[`tourArrow${popoverPos.arrow.charAt(0).toUpperCase() + popoverPos.arrow.slice(1)}`]}`} />
            <div className={styles.tourHeader}>
              <h3 className={styles.tourTitle}>{TOUR_STEPS[tourStep - 1].title}</h3>
            </div>
            <div className={styles.tourContent}>
              {TOUR_STEPS[tourStep - 1].content}
            </div>
            <div className={styles.tourFooter}>
              <button className={styles.tourSkip} onClick={handleSkipTour}>Lewati</button>
              <button className={styles.tourNext} onClick={handleNextTour}>
                {tourStep === 8 ? 'Selesai' : `Lanjut (${tourStep} / 8)`}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


