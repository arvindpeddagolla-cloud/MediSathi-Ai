// Global Reactive State Store for MediSathi AI with Full Interactivity & Calendar History

class Store {
  constructor() {
    this.state = {
      currentLanguage: 'en', // 'en' | 'te' | 'hi' | 'ta'
      activeTab: 'home', // 'home' | 'medicines' | 'health' | 'reports' | 'ai' | 'profile'
      activeModal: null, // null | 'scanner' | 'reminder' | 'sms' | 'voiceCall' | 'profile' | 'medDetails' | 'calendarPicker' | 'vitalLogger'
      
      // Patient Info
      patient: {
        name: "Arvind",
        age: 68,
        gender: "Male",
        bloodGroup: "O+",
        avatarUrl: "https://lh3.googleusercontent.com/aida/AEtjO1Vhbk7JqSRCghH4XIRiaHCRlJn8iVCfjAIPrnjs9rpuAzpzD_0s6Q5XSlU_Y1sKcbK07BbZJpv75UJnoSpRkSXEse2wQWdWu5vE0ZGOd4WkjpVqqvSkXnkZEAMvHWE1BpuiL58TjUv3Cepaxq-aNa5kD-WcZqP9ZrtmEDsY3dOZp4LlA4r_mnUCsJ7TYMRv6widouVAH0OqEF9s8NE0Fn51r4sBwSixypw3kpwpRAIC5PZz9ekg3I2EvRs",
        logoUrl: "https://lh3.googleusercontent.com/aida/AEtjO1WZ4Ek0_hdwqIenDjDxDc_rVRVBPUeP6sToNgBd51-s8TWjczcTl_Z18Np1bRXWEpISsaeugiV2uOeziuxD-NxJFqmKnAXIkX6AOV2nez8HyAbGWEFVF77SqU21FCzzLqSqb7vOW6Qnqq1aR3hz9duW_YP7cEDGG4cMhuGxQV0YAepd11ScbGbsIkorC7jqivy83ABGdepp7ok1jDS4qgiQUwVJaPMRi9TO8YOYj3rvQEH9qyikwVgWTA"
      },

      // Interactive Calendar State
      calendar: {
        selectedDate: 15, // September 15, 2026 (Today)
        month: 'September',
        year: 2026,
        days: [
          { day: 11, weekday: 'Thu', status: 'completed', adherence: 100 },
          { day: 12, weekday: 'Fri', status: 'completed', adherence: 100 },
          { day: 13, weekday: 'Sat', status: 'completed', adherence: 100 },
          { day: 14, weekday: 'Sun', status: 'completed', adherence: 75 },
          { day: 15, weekday: 'Mon', isToday: true, status: 'in-progress', adherence: 75 },
          { day: 16, weekday: 'Tue', status: 'upcoming', adherence: null },
          { day: 17, weekday: 'Wed', status: 'upcoming', adherence: null },
          { day: 18, weekday: 'Thu', status: 'upcoming', adherence: null },
          { day: 19, weekday: 'Fri', status: 'upcoming', adherence: null },
          { day: 20, weekday: 'Sat', status: 'upcoming', adherence: null },
        ]
      },

      // Medicine filter
      medFilter: 'all', // 'all' | 'morning' | 'lunch' | 'dinner' | 'unconfirmed'
      selectedMedicineForDetails: null,

      // Medications List (Default for Today 15th)
      medications: [
        {
          id: 'med-1',
          name: 'Paracetamol',
          brand: 'Dolo / Calpol 500',
          strength: '500 mg',
          time: '09:00 AM',
          slot: 'Morning',
          instruction: 'After food',
          instructionTe: 'ఆహారం తర్వాత',
          instructionHi: 'भोजन के बाद',
          instructionTa: 'உணவுக்குப் பின்',
          purpose: 'Mild body ache & fever control',
          purposeTe: 'శరీర నొప్పులు మరియు జ్వరం నియంత్రణ',
          doctor: 'Dr. K. S. Rao, MD (General Medicine)',
          status: 'taken', // 'taken' | 'unconfirmed' | 'snoozed' | 'pending'
          loggedTime: '08:15 AM',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC17ArVOML7jZr9gKaKW2mALa6YnORcvJGdHSWaMRHCR1T1Taxrnpiob3Ej_UJBY0rFKAqjwZ5Vp80VJlQ2y9BiilY8KFBkSR-3hk3Wv7wxwnvsNG6LQK_l38Y1u_gadWflS_w_qprUUgvRqiAqTHwlzrAIhOUOc0Yu-4r910yih2OwpLF2iBMqt-AnANrDIPHvILY6K23dFtHvFKotFuA_PdFUh8poO1vya3a00PW-bNkGHvmFBv0s'
        },
        {
          id: 'med-2',
          name: 'Metformin',
          brand: 'Glycomet 500',
          strength: '500 mg',
          time: '02:00 PM',
          slot: 'Lunch',
          instruction: 'Before food',
          instructionTe: 'ఆహారానికి ముందు',
          instructionHi: 'भोजन से पहले',
          instructionTa: 'உணவுக்கு முன்',
          purpose: 'Blood sugar regulation',
          purposeTe: 'రక్తంలో గ్లూకోజ్ స్థాయిలను నియంత్రించడం',
          doctor: 'Dr. S. Meenakshi, DM (Endocrinology)',
          status: 'unconfirmed',
          loggedTime: null,
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQD608k7ssWlSvZPkCFrIqd_M4jNGyYxxwQ_W_TBsQcgGFegwNhZA4dRMY8xQRmvv7YamCodJMmPMBEF3zYYNn13FSPLBIza3Iv_ATPObPOqKVdT9YeeOD8K2Ah9V2YppsEWdvbN7f4ID5eIE9VFw3XfDKBSO5BvjO0Z2DB-Gf1J-VfCuBIZWWnEBozG2YPeddNUIhqb3qfDh2OUcU-8PFCJReGqwxxmze_HfMYPZ6Zkf3K_DJeZoB'
        },
        {
          id: 'med-3',
          name: 'Atorvastatin',
          brand: 'Atorva 10',
          strength: '10 mg',
          time: '08:00 PM',
          slot: 'Dinner',
          instruction: 'After food',
          instructionTe: 'ఆహారం తర్వాత',
          instructionHi: 'भोजन के बाद',
          instructionTa: 'உணவுக்குப் பின்',
          purpose: 'Cholesterol & cardiovascular health',
          purposeTe: 'గుండె ఆరోగ్యం మరియు కొలెస్ట్రాల్ నియంత్రణ',
          doctor: 'Dr. V. Raman, MD (Cardiology)',
          status: 'pending',
          loggedTime: null,
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbQ8fCbKsynSoMzsbsqpKv_R91ngCoZcoGcBH3WPXPAwfgpkB6YGVC-HiPKaS2pLlKa4jKUqfZ9OpcE1Hw-suZmSmgpAjK0KnTV4dscNZKaEK4GR7QkuWnNTAyxYn_eZuBR9D87o_wQOjnYBsJqOCQ3lqAQc6U9Wy4d-4McqD-gtXvstW0TgbdMJLMwK50S10tChyjDhwEWzRROO-Bi_wx6_-agBTBd0M3Gh7V6UrM7aZXXDGpaMGa'
        },
        {
          id: 'med-4',
          name: 'Vitamin D3',
          brand: 'Calcirol 60K',
          strength: '60K IU',
          time: 'Weekly Sun',
          slot: 'Morning',
          instruction: 'With milk/food',
          instructionTe: 'పాలతో లేదా ఆహారంతో',
          instructionHi: 'दूध के साथ',
          instructionTa: 'பாலுடன்',
          purpose: 'Bone strength & calcium absorption',
          purposeTe: 'ఎముకల బలం మరియు రోగనిరోధక శక్తి',
          doctor: 'Dr. K. S. Rao, MD',
          status: 'taken',
          loggedTime: 'Yesterday 09:00 AM',
          imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDY2W_0EoZ1Wc83c9BuG5f1FjjyY2GLU_l95j4k9ptbOmojofv14qt9mf91qpZ8S6el4WSA1gYx63gKT2c5T3e-CybD8748x4WUXPKXTtFt2tIxwGO720C1Sc74FDUlVk_xJXH7sDdSCano-FE6nXx7wV00IoFIAGss5Pyu1yMFzTCBnTDU5AakKQ5e2l6QXJS-mFa8qplrSDZAWEnx0mHGDEdz9Xy0qbfslQK6zsMYlbwihvqzDEU'
        }
      ],

      // Vitals & Health Track
      vitals: {
        score: 82,
        heartRate: 72,
        bloodPressure: '120/80',
        weight: 68.2,
        sleep: '7h 20m',
        waterLiters: 1.8,
        adherencePercent: 88,
        selectedTrendTab: '7D' // '7D' | '30D' | '3M'
      },

      // Medical Reports
      selectedReportId: 'rep-cbc',
      reports: [
        {
          id: 'rep-cbc',
          title: 'CBC Panel',
          subtitle: 'Complete Blood Count (CBC) • Apollo Diagnostics, Hyd',
          date: '12 Sep 2026 • 10:45 AM',
          status: 'analyzed',
          biomarker: 'Hemoglobin (Hb)',
          description: 'Blood Oxygen Carrier Protein',
          value: '11.2',
          unit: 'g/dL',
          referenceRange: '12.0 – 16.0',
          rangeStatus: 'below',
          explanationEn: 'Your hemoglobin result is 11.2 g/dL, which is below the normal reference range (12.0 – 16.0 g/dL) shown on this lab report. Hemoglobin carries oxygen throughout your body. Discuss this result with your doctor.',
          explanationTe: 'మీ హీమోగ్లోబిన్ ఫలితం 11.2 g/dL గా ఉంది. ఇది ఈ ల్యాబ్ రిపోర్ట్ ప్రకారం సాధారణ పరిమితి (12.0 – 16.0 g/dL) కంటే తక్కువగా ఉంది. మీ వైద్య నిపుణుడితో ఈ ఫలితాన్ని చర్చించండి.',
          explanationHi: 'आपका हीमोग्लोबिन परिणाम 11.2 g/dL है, जो इस लैब रिपोर्ट में दिखाई गई सामान्य संदर्भ सीमा (12.0 - 16.0 g/dL) से कम है। कृपया अपने डॉक्टर से परामर्श लें।',
          explanationTa: 'உங்கள் ஹீமோகுளோபின் அளவு 11.2 g/dL ஆகும். இது ஆய்வக வரம்பை (12.0 - 16.0 g/dL) விட குறைவாக உள்ளது. உங்கள் மருத்துவரிடம் ஆலோசிக்கவும்.'
        },
        {
          id: 'rep-sugar',
          title: 'HbA1c & Fasting Glucose',
          subtitle: 'Diabetes Checkup • Vijaya Diagnostics',
          date: '10 Aug 2026',
          status: 'analyzed',
          biomarker: 'HbA1c (Glycated Hemoglobin)',
          description: '3-Month Average Blood Sugar',
          value: '6.4',
          unit: '%',
          referenceRange: '< 5.7',
          rangeStatus: 'above',
          explanationEn: 'Your HbA1c is 6.4%, showing fair blood sugar control. Continue regular diet and exercise as advised by your physician.',
          explanationTe: 'మీ HbA1c 6.4% గా ఉంది. ఆహార నియమాలు మరియు మందులను డాక్టర్ సూచనల మేరకు కొనసాగించండి.',
          explanationHi: 'आपका HbA1c 6.4% है। डॉक्टर की सलाह के अनुसार आहार और दवाएं जारी रखें।',
          explanationTa: 'உங்கள் HbA1c 6.4% ஆகும். மருத்துவரின் ஆலோசனைப்படி மருந்து மற்றும் உணவை பின்பற்றவும்.'
        },
        {
          id: 'rep-lipid',
          title: 'Lipid Profile',
          subtitle: 'Cholesterol & Triglycerides • Care Hospital',
          date: '15 Jul 2026',
          status: 'analyzed',
          biomarker: 'Total Cholesterol',
          description: 'Blood Lipid Assessment',
          value: '185',
          unit: 'mg/dL',
          referenceRange: '< 200',
          rangeStatus: 'normal',
          explanationEn: 'Your total cholesterol is 185 mg/dL, which is within the normal reference range.',
          explanationTe: 'మీ కొలెస్ట్రాల్ 185 mg/dL గా ఉంది. ఇది సాధారణ పరిమితిలోనే ఉంది.',
          explanationHi: 'आपका कुल कोलेस्ट्रॉल 185 mg/dL है, जो सामान्य सीमा के भीतर है।',
          explanationTa: 'உங்கள் கொழுப்பு அளவு 185 mg/dL ஆகும். இது சரியான வரம்பில் உள்ளது.'
        }
      ],

      // Caregiver & Channels
      caregiver: {
        name: "Priya (Daughter)",
        relation: "Daughter",
        phone: "+91 98765 43210",
        permissionActive: true,
        status: "Active ✓"
      },

      channels: {
        push: true,
        sms: true,
        voiceCall: true
      },

      // AI Chat Stream
      aiChat: [
        {
          sender: 'ai',
          textEn: "Namaste Arvind garu! I am MediSathi AI. I have reviewed your CBC report. Your Hemoglobin (11.2 g/dL) is below the laboratory reference range. How can I assist you with your report?",
          textTe: "నమస్కారం అరవింద్ గారు! నేను మీ మెడిసాథి AI అసిస్టెంట్. మీ CBC రిపోర్ట్ ప్రకారం హీమోగ్లోబిన్ (11.2 g/dL) సాధారణ పరిమితి కంటే తక్కువగా ఉంది. మీకు ఏమైనా సందేహాలు ఉన్నాయా?",
          textHi: "नमस्ते अरविंद जी! मैं आपका मेडिसाथी AI सहायक हूँ। आपकी CBC रिपोर्ट के अनुसार हीमोग्लोबिन 11.2 g/dL है। मैं आपकी क्या सहायता कर सकता हूँ?",
          textTa: "வணக்கம் அரவிந்த் அவர்களே! நான் உங்கள் மெடிசாதி AI உதவியாளர். உங்கள் அறிக்கை குறித்து ஏதேனும் சந்தேகம் உள்ளதா?",
          timestamp: "Just now"
        }
      ]
    };

    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  setLanguage(lang) {
    this.state.currentLanguage = lang;
    this.notify();
  }

  setActiveTab(tab) {
    this.state.activeTab = tab;
    this.notify();
  }

  openModal(modalName) {
    this.state.activeModal = modalName;
    this.notify();
  }

  closeModal() {
    this.state.activeModal = null;
    this.notify();
  }

  selectCalendarDate(dayNum) {
    this.state.calendar.selectedDate = dayNum;
    
    // Simulate past vs today vs future date medication lists
    if (dayNum < 15) {
      // Past day: all taken
      this.state.medications.forEach(m => {
        m.status = 'taken';
        m.loggedTime = 'Completed on time';
      });
    } else if (dayNum === 15) {
      // Today: restore current dynamic states
      this.state.medications[0].status = 'taken';
      this.state.medications[1].status = 'unconfirmed';
      this.state.medications[2].status = 'pending';
    } else {
      // Upcoming days: pending schedule
      this.state.medications.forEach(m => {
        m.status = 'pending';
        m.loggedTime = null;
      });
    }
    this.notify();
  }

  setMedFilter(filter) {
    this.state.medFilter = filter;
    this.notify();
  }

  openMedicineDetails(med) {
    this.state.selectedMedicineForDetails = med;
    this.openModal('medDetails');
  }

  openReminderAlarm(med) {
    this.state.selectedMedicineForDetails = med;
    this.openModal('reminder');
  }

  selectReport(reportId) {
    this.state.selectedReportId = reportId;
    this.notify();
  }

  markDoseTaken(medId) {
    const med = this.state.medications.find(m => m.id === medId);
    if (med) {
      med.status = 'taken';
      med.loggedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Update adherence calculation
      const takenCount = this.state.medications.filter(m => m.status === 'taken').length;
      this.state.vitals.score = Math.min(100, 75 + takenCount * 5);
      this.notify();
    }
  }

  snoozeDose(medId) {
    const med = this.state.medications.find(m => m.id === medId);
    if (med) {
      med.status = 'snoozed';
      this.notify();
    }
  }

  deleteMedication(medId) {
    const med = this.state.medications.find(m => m.id === medId);
    const medName = med ? `${med.name} ${med.strength}` : 'Medicine';
    this.state.medications = this.state.medications.filter(m => m.id !== medId);
    if (this.state.selectedMedicineForDetails && this.state.selectedMedicineForDetails.id === medId) {
      this.state.selectedMedicineForDetails = null;
      this.closeModal();
    }
    this.notify();
    return medName;
  }

  undoDose(medId) {
    const med = this.state.medications.find(m => m.id === medId);
    if (med) {
      med.status = 'unconfirmed';
      med.loggedTime = null;
      this.notify();
    }
  }

  addCustomScheduleMedicine(data) {
    const id = 'med-' + Date.now();
    const time = data.time || '09:00 AM';
    const slot = data.slot || 'Morning';
    const instruction = data.instruction || 'After food';
    const instructionTe = data.instructionTe || (instruction.includes('Before') ? 'ఆహారానికి ముందు' : 'ఆహారం తర్వాత');
    
    const newMed = {
      id: id,
      name: data.name || 'Amoxicillin',
      brand: data.brand || 'Prescribed Medication',
      strength: data.strength || '500 mg',
      time: time,
      slot: slot,
      instruction: instruction,
      instructionTe: instructionTe,
      instructionHi: data.instructionHi || 'भोजन के बाद',
      instructionTa: data.instructionTa || 'உணவுக்குப் பின்',
      targetPhone: data.targetPhone || '+918106890663',
      purpose: data.purpose || 'Doctor Prescribed Antibiotic / Care Treatment',
      purposeTe: data.purposeTe || 'వైద్యులు సూచించిన చికిత్స',
      doctor: data.doctor || 'Dr. K. S. Rao, MD',
      status: 'unconfirmed',
      loggedTime: null,
      imageUrl: data.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuC17ArVOML7jZr9gKaKW2mALa6YnORcvJGdHSWaMRHCR1T1Taxrnpiob3Ej_UJBY0rFKAqjwZ5Vp80VJlQ2y9BiilY8KFBkSR-3hk3Wv7wxwnvsNG6LQK_l38Y1u_gadWflS_w_qprUUgvRqiAqTHwlzrAIhOUOc0Yu-4r910yih2OwpLF2iBMqt-AnANrDIPHvILY6K23dFtHvFKotFuA_PdFUh8poO1vya3a00PW-bNkGHvmFBv0s'
    };

    this.state.medications.unshift(newMed);
    this.notify();
    return newMed;
  }

  addPrescriptionMedicine(medicine) {
    const newMed = {
      id: 'med-' + Date.now(),
      name: medicine.name || 'Paracetamol',
      brand: medicine.brand || 'Prescribed Drug',
      strength: medicine.strength || '500 mg',
      time: medicine.time || '08:30 PM',
      slot: medicine.slot || 'Dinner',
      instruction: medicine.instruction || 'After food',
      instructionTe: 'ఆహారం తర్వాత',
      instructionHi: 'भोजन के बाद',
      instructionTa: 'உணவுக்குப் பின்',
      purpose: 'Prescribed medication regimen',
      purposeTe: 'వైద్యులు సూచించిన మందుల మోతాదు',
      doctor: 'Dr. Vision AI Verified (General Hospital)',
      status: 'pending',
      loggedTime: null,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC17ArVOML7jZr9gKaKW2mALa6YnORcvJGdHSWaMRHCR1T1Taxrnpiob3Ej_UJBY0rFKAqjwZ5Vp80VJlQ2y9BiilY8KFBkSR-3hk3Wv7wxwnvsNG6LQK_l38Y1u_gadWflS_w_qprUUgvRqiAqTHwlzrAIhOUOc0Yu-4r910yih2OwpLF2iBMqt-AnANrDIPHvILY6K23dFtHvFKotFuA_PdFUh8poO1vya3a00PW-bNkGHvmFBv0s'
    };
    this.state.medications.push(newMed);
    this.notify();
  }

  toggleCaregiverPermission() {
    this.state.caregiver.permissionActive = !this.state.caregiver.permissionActive;
    this.notify();
  }

  toggleChannel(channelKey) {
    if (this.state.channels[channelKey] !== undefined) {
      this.state.channels[channelKey] = !this.state.channels[channelKey];
      this.notify();
    }
  }

  logWater() {
    this.state.vitals.waterLiters = +(this.state.vitals.waterLiters + 0.25).toFixed(2);
    this.notify();
  }

  setTrendTab(tab) {
    this.state.vitals.selectedTrendTab = tab;
    this.notify();
  }

  addAIChat(message, isUser = false) {
    if (isUser) {
      this.state.aiChat.push({
        sender: 'user',
        textEn: message,
        textTe: message,
        textHi: message,
        textTa: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      this.state.aiChat.push(message);
    }
    this.notify();
  }
}

export const store = new Store();
