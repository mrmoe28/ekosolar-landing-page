// EkoSolar AI Chatbot - Georgia Solar Installation Expert
// Optimized for lead generation and customer education

const { useState, useEffect, useRef } = React;
const { MessageCircle, X, Send, Phone, Calculator, FileText, Star, Zap, Sun, Battery } = LucideReact;

const EkoSolarChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [currentFlow, setCurrentFlow] = useState('welcome');
  const [userProfile, setUserProfile] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage("👋 Hi! I'm EkoBot, your solar energy assistant for Georgia! I help homeowners discover how solar can save money and power their homes with clean energy. What brings you here today?", 'welcome');
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text, flow = null, options = null) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const message = {
        id: Date.now(),
        text,
        sender: 'bot',
        timestamp: new Date(),
        flow,
        options
      };
      setMessages(prev => [...prev, message]);
      if (flow) setCurrentFlow(flow);
      setIsTyping(false);
      
      // Track in analytics
      trackChatEvent('bot_message', flow || 'general');
    }, 800);
  };

  const addUserMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
    
    // Track in analytics
    trackChatEvent('user_message', 'response');
  };

  const trackChatEvent = (action, label) => {
    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: 'EkoSolar_Chatbot',
        event_label: label,
        value: 1
      });
    }
    
    // EkoSolar tracking for lead analysis
    if (typeof EkoSolarTracking !== 'undefined') {
      EkoSolarTracking.trackEvent('chatbot_interaction', {
        action,
        label,
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleQuickAction = (action, value) => {
    addUserMessage(value);
    
    setTimeout(() => {
      switch (action) {
        case 'calculate':
          addBotMessage("Perfect! I'll help you calculate your potential solar savings. Georgia homeowners typically save 80-90% on their electric bills with solar! First, what's your approximate monthly electricity bill?", 'calculator', [
            { text: '$50-100', value: '75', action: 'bill_amount' },
            { text: '$100-200', value: '150', action: 'bill_amount' },
            { text: '$200-300', value: '250', action: 'bill_amount' },
            { text: '$300-500', value: '400', action: 'bill_amount' },
            { text: '$500+', value: '600', action: 'bill_amount' }
          ]);
          trackChatEvent('calculator_started', 'savings_calculator');
          break;
        
        case 'learn':
          addBotMessage("Great choice! Here's why solar is perfect for Georgia homeowners:", 'education');
          setTimeout(() => {
            addBotMessage("☀️ Georgia averages 217+ sunny days per year - perfect for solar!\\n💰 30% Federal Tax Credit (expires Dec 2025) - save thousands!\\n⚡ Net metering with Georgia Power - get credit for excess energy\\n🏠 Increase home value by 3-4% immediately\\n🔒 Lock in energy costs for 25+ years\\n🌱 Reduce carbon footprint by 3-4 tons annually\\n\\nWhat interests you most?", 'education', [
              { text: 'Installation Process', value: 'How does installation work?', action: 'process' },
              { text: 'Costs & Financing', value: 'What are the costs?', action: 'costs' },
              { text: 'Georgia Incentives', value: 'Tell me about incentives', action: 'incentives' },
              { text: 'Get Free Quote', value: 'I want a quote', action: 'quote' }
            ]);
          }, 1500);
          trackChatEvent('education_started', 'solar_benefits');
          break;
        
        case 'emergency':
          addBotMessage("🚨 Solar system emergency? We're here 24/7! Our certified technicians provide immediate assistance throughout Georgia.", 'emergency');
          setTimeout(() => {
            addBotMessage("Emergency Solar Services:\\n\\n⚡ System not producing power\\n🔧 Inverter failures\\n⛈️ Storm damage assessment\\n🔥 Electrical safety concerns\\n💡 Complete system outages\\n\\n📞 Emergency Hotline: (404) 364-5456\\n⏰ Available 24/7/365\\n\\nWhat type of emergency are you experiencing?", 'emergency', [
              { text: 'Call Emergency Line', value: 'Call emergency number', action: 'emergency_call' },
              { text: 'System Not Working', value: 'My system is not working', action: 'system_down' },
              { text: 'Storm Damage', value: 'Storm damaged my panels', action: 'storm_damage' },
              { text: 'Schedule Repair', value: 'Schedule repair service', action: 'schedule_repair' }
            ]);
          }, 1000);
          trackChatEvent('emergency_started', 'emergency_service');
          break;
        
        case 'contact':
          addBotMessage("I'd love to connect you with our Georgia solar experts! EkoSolarPros has helped thousands of Georgia families go solar. Here's how to reach us:", 'contact');
          setTimeout(() => {
            addBotMessage("📞 Call: (404) 364-5456 (7652)\\n📧 Email: info@ekosolarpros.com\\n🏢 Serving: Atlanta, Savannah, Columbus, Augusta, Macon & all of Georgia\\n📅 Free consultations available weekdays & weekends\\n⏰ Monday-Friday: 8 AM - 7 PM\\n⏰ Saturday: 9 AM - 5 PM\\n⏰ Sunday: 10 AM - 4 PM\\n\\nWhat works best for you?", 'contact', [
              { text: 'Schedule Free Consultation', value: 'Schedule consultation', action: 'schedule' },
              { text: 'Call Now', value: 'I want to call now', action: 'call' },
              { text: 'Email Quote Request', value: 'Send me info by email', action: 'email' },
              { text: 'Text Me Details', value: 'Text me information', action: 'text' }
            ]);
          }, 1000);
          trackChatEvent('contact_started', 'contact_info');
          break;

        case 'bill_amount':
          const bill = parseInt(value);
          const estimatedSavings = Math.round(bill * 0.87); // Georgia average 87% savings
          const systemSize = Math.round(bill * 0.12); // Rough calculation
          const estimatedCost = systemSize * 2800; // Georgia average $2.80/watt
          const afterCredit = Math.round(estimatedCost * 0.7); // After 30% tax credit
          const paybackYears = Math.round(afterCredit / (estimatedSavings * 12));
          const lifetimeSavings = Math.round((estimatedSavings * 12 * 25) - afterCredit);
          
          setUserProfile({ ...userProfile, monthlyBill: bill, systemSize, estimatedCost });
          
          addBotMessage(`Great! Based on a $${bill}/month electric bill in Georgia, here's your solar potential:\\n\\n☀️ Recommended System Size: ${systemSize} kW\\n💰 Estimated Monthly Savings: $${estimatedSavings}\\n🏠 System Investment: $${estimatedCost.toLocaleString()}\\n🎯 After 30% Tax Credit: $${afterCredit.toLocaleString()}\\n📈 Payback Period: ~${paybackYears} years\\n💵 25-Year Savings: $${lifetimeSavings.toLocaleString()}\\n\\n*Estimates based on Georgia Power rates and solar production\\n\\nReady to make this a reality?`, 'calculator_result', [
            { text: 'Get Detailed Quote', value: 'Send me detailed quote', action: 'detailed_quote' },
            { text: 'Learn About Financing', value: 'Tell me about financing', action: 'financing' },
            { text: 'Schedule Site Assessment', value: 'Schedule assessment', action: 'assessment' },
            { text: 'Call Solar Expert', value: 'Call expert now', action: 'expert_call' }
          ]);
          trackChatEvent('calculator_completed', `bill_${bill}`);
          break;

        case 'process':
          addBotMessage("Here's exactly how EkoSolar makes going solar simple in Georgia:\\n\\n📋 **Step 1: Free Consultation** (30 min)\\n• Site assessment & energy analysis\\n• Custom system design\\n• Financing options review\\n\\n📄 **Step 2: Permits & Approvals** (2-3 weeks)\\n• We handle all paperwork\\n• City permits & utility applications\\n• HOA approvals if needed\\n\\n🔨 **Step 3: Professional Installation** (1-3 days)\\n• Certified installers only\\n• Complete in 1-3 days\\n• Full cleanup included\\n\\n🔌 **Step 4: System Activation** (1-2 weeks)\\n• Utility inspection & approval\\n• Net metering setup\\n• System monitoring activation\\n\\nReady to get started?", 'process', [
            { text: 'Schedule Free Assessment', value: 'Schedule free assessment', action: 'schedule' },
            { text: 'Get Timeline for My Home', value: 'What is my timeline?', action: 'timeline' },
            { text: 'View Installation Portfolio', value: 'Show me your work', action: 'portfolio' }
          ]);
          break;

        case 'costs':
          addBotMessage("Let's break down solar costs in Georgia (transparent pricing guaranteed!):\\n\\n💰 **Average System Costs:**\\n• Residential (6kW): $16,800 before incentives\\n• After 30% tax credit: $11,760\\n• Monthly payment: $89-125 (vs $200+ utility bill)\\n\\n💳 **Financing Options:**\\n• $0 down solar loans (2.99% APR)\\n• Solar leases ($89/month)\\n• Power purchase agreements\\n• Cash purchase (best ROI)\\n\\n🎯 **Georgia Advantages:**\\n• No state sales tax on solar\\n• Property tax exemption\\n• 25-year warranties\\n• Net metering credits\\n\\nWant personalized pricing?", 'costs', [
            { text: 'Get My Exact Price', value: 'Give me personalized pricing', action: 'pricing' },
            { text: 'Compare Financing Options', value: 'Compare financing', action: 'financing' },
            { text: 'Calculate Loan Payment', value: 'Calculate my payment', action: 'payment_calc' }
          ]);
          break;

        case 'incentives':
          addBotMessage("Georgia has some of the BEST solar incentives in the Southeast! Here's what you get:\\n\\n🇺🇸 **Federal Incentives:**\\n• 30% Tax Credit (expires Dec 2025!)\\n• Save $5,000-15,000 instantly\\n\\n🍑 **Georgia State Benefits:**\\n• No sales tax on solar equipment\\n• Property tax exemption (no increase)\\n• Net metering - sell excess power back\\n\\n⚡ **Utility Programs:**\\n• Georgia Power net billing\\n• Time-of-use rate optimization\\n• Interconnection support\\n\\n⚠️ **Act Fast:** Federal credit drops to 26% in 2026, then 22% in 2027!\\n\\nReady to claim your incentives?", 'incentives', [
            { text: 'Calculate My Incentives', value: 'Calculate my total incentives', action: 'incentive_calc' },
            { text: 'Get Quote Before Deadline', value: 'Get quote before deadline', action: 'urgent_quote' },
            { text: 'Learn About Net Metering', value: 'Explain net metering', action: 'net_metering' }
          ]);
          break;

        case 'quote':
        case 'schedule':
        case 'detailed_quote':
        case 'assessment':
          addBotMessage("Perfect! Let's get you connected with our Georgia solar experts for a FREE consultation. Here's what you'll get:\\n\\n✅ Complete energy analysis\\n✅ Custom system design\\n✅ Exact pricing & financing\\n✅ Permit & installation timeline\\n✅ Incentive calculations\\n✅ 25-year production guarantee\\n\\nWhat's the best way to reach you?", 'lead_capture');
          setTimeout(() => {
            addBotMessage("Please provide:\\n\\n📧 Email address\\n📞 Phone number\\n📍 City in Georgia\\n🏠 Property type (house/townhome/etc)\\n⚡ Monthly electric bill range\\n\\nOur certified solar consultants will contact you within 2 hours with a personalized quote!", 'lead_capture', [
              { text: 'Call Me: (404) 364-5456', value: 'Call me at your number', action: 'call_now' },
              { text: 'Text Me Information', value: 'Text me details', action: 'text_info' },
              { text: 'Email Quote Request', value: 'Email me a quote', action: 'email_info' },
              { text: 'Live Chat with Expert', value: 'Connect me now', action: 'live_chat' }
            ]);
          }, 1500);
          trackChatEvent('quote_requested', 'lead_generation');
          break;

        case 'financing':
          addBotMessage("EkoSolar makes solar affordable with multiple financing options in Georgia:\\n\\n💰 **Solar Loans (Most Popular):**\\n• $0 down payment\\n• 2.99-5.99% APR\\n• 12-25 year terms\\n• Own your system immediately\\n• Qualify for all tax credits\\n\\n📋 **Solar Leases:**\\n• $0-$999 down\\n• Fixed monthly payment\\n• Maintenance included\\n• 20-year terms\\n\\n⚡ **Power Purchase Agreements:**\\n• $0 down\\n• Pay only for power produced\\n• Rates locked for 20 years\\n\\n💵 **Cash Purchase:**\\n• Best return on investment\\n• Full tax benefits\\n• Quickest payback\\n\\nWhich option interests you most?", 'financing', [
            { text: 'Compare All Options', value: 'Compare financing options', action: 'compare_financing' },
            { text: 'Check My Qualification', value: 'Am I qualified?', action: 'credit_check' },
            { text: 'Get Pre-Approved', value: 'Get pre-approved', action: 'preapproval' }
          ]);
          break;

        case 'emergency_call':
          addBotMessage("🚨 **EMERGENCY SOLAR SERVICE**\\n\\n📞 Call NOW: **(404) 364-5456**\\n\\n🔧 **Our emergency team provides:**\\n• Immediate phone diagnosis\\n• Same-day service calls\\n• Certified electricians on-call\\n• Safety assessments\\n• Insurance claim assistance\\n\\n⚡ **Available 24/7/365** throughout Georgia\\n\\n**SAFETY FIRST:** If you smell burning, see sparks, or have electrical concerns, call 911 first, then call us!");
          trackChatEvent('emergency_call', 'urgent_service');
          break;

        case 'call_now':
          addBotMessage("📞 **Call EkoSolarPros Now:**\\n\\n**(404) 364-5456 (7652)**\\n\\n🕘 **Current Hours:**\\n• Monday-Friday: 8 AM - 7 PM\\n• Saturday: 9 AM - 5 PM\\n• Sunday: 10 AM - 4 PM\\n• Emergency Service: 24/7\\n\\n💬 **Mention this chat for:**\\n• Priority scheduling\\n• $500 additional discount\\n• Free system monitoring\\n\\nOur solar experts are standing by!");
          trackChatEvent('phone_call', 'direct_contact');
          break;

        case 'email_info':
          addBotMessage("📧 **Email Us Your Information:**\\n\\n**Send to:** info@ekosolarpros.com\\n\\n**Include:**\\n✅ Your full address\\n✅ Monthly electric bill amount\\n✅ Best phone number\\n✅ Preferred contact time\\n✅ Any specific questions\\n\\n**You'll receive within 24 hours:**\\n• Personalized system proposal\\n• Exact pricing & incentives\\n• Financing options\\n• Installation timeline\\n• References from your area\\n\\n*Subject: Solar Quote Request - Priority*");
          trackChatEvent('email_request', 'lead_capture');
          break;

        case 'text_info':
          addBotMessage("📱 **Get Solar Info by Text:**\\n\\nText **\"SOLAR QUOTE\"** to:\\n**(404) 364-5456**\\n\\n**You'll receive:**\\n• Quick response (within 30 min)\\n• Link to personalized calculator\\n• Appointment scheduling link\\n• Local installer contact\\n• Current incentive updates\\n\\n**Or we can text you:**\\nJust provide your cell number and we'll send you a comprehensive solar information packet!");
          trackChatEvent('text_request', 'mobile_lead');
          break;

        default:
          addBotMessage("I'd be happy to help you with that! Let me connect you with our Georgia solar experts who can provide detailed information and a personalized consultation.", 'general', [
            { text: 'Get Free Quote', value: 'I want a free quote', action: 'quote' },
            { text: 'Calculate Savings', value: 'Calculate my savings', action: 'calculate' },
            { text: 'Call (404) 364-5456', value: 'Call now', action: 'call_now' },
            { text: 'Schedule Consultation', value: 'Schedule consultation', action: 'schedule' }
          ]);
      }
    }, 1200);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      const input = inputValue.toLowerCase();
      setInputValue('');
      
      setTimeout(() => {
        // Smart response logic
        if (input.includes('cost') || input.includes('price') || input.includes('expensive')) {
          handleQuickAction('costs', 'What are the costs?');
        } else if (input.includes('calculator') || input.includes('calculate') || input.includes('savings')) {
          handleQuickAction('calculate', 'Calculate my savings');
        } else if (input.includes('emergency') || input.includes('broken') || input.includes('not working')) {
          handleQuickAction('emergency', 'I need emergency service');
        } else if (input.includes('call') || input.includes('phone') || input.includes('talk')) {
          handleQuickAction('contact', 'I want to speak with someone');
        } else if (input.includes('finance') || input.includes('loan') || input.includes('payment')) {
          handleQuickAction('financing', 'Tell me about financing');
        } else if (input.includes('incentive') || input.includes('tax credit') || input.includes('rebate')) {
          handleQuickAction('incentives', 'Tell me about incentives');
        } else if (input.includes('process') || input.includes('install') || input.includes('how')) {
          handleQuickAction('process', 'How does installation work?');
        } else {
          addBotMessage("Great question! Our solar experts can help you with that. Here's how to get personalized assistance:", 'general', [
            { text: 'Get Free Quote', value: 'I want a free quote', action: 'quote' },
            { text: 'Calculate My Savings', value: 'Calculate savings', action: 'calculate' },
            { text: 'Call Solar Expert', value: 'Call expert', action: 'call_now' },
            { text: 'Learn More About Solar', value: 'Learn about solar', action: 'learn' }
          ]);
        }
      }, 1000);
    }
  };

  const TypingIndicator = () => (
    React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        background: 'white',
        borderRadius: '0.5rem',
        border: '1px solid #e5e7eb',
        maxWidth: '80%'
      }
    }, [
      React.createElement('div', {
        key: 'avatar',
        style: {
          width: '1.5rem',
          height: '1.5rem',
          background: 'linear-gradient(135deg, #f59e0b, #eab308)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem'
        }
      }, '☀️'),
      React.createElement('div', {
        key: 'dots',
        style: {
          display: 'flex',
          gap: '0.25rem'
        }
      }, [1, 2, 3].map(i => React.createElement('div', {
        key: i,
        style: {
          width: '0.5rem',
          height: '0.5rem',
          background: '#9ca3af',
          borderRadius: '50%',
          animation: `typing-dot 1.4s infinite ease-in-out`,
          animationDelay: `${(i - 1) * 0.16}s`
        }
      })))
    ])
  );

  if (!isOpen) {
    return React.createElement('div', {
      className: "fixed bottom-4 right-4 z-50",
      style: { position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 9999 }
    }, [
      React.createElement('button', {
        key: 'btn',
        onClick: () => setIsOpen(true),
        className: "bg-gradient-to-r from-solar-orange to-solar-yellow text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110",
        style: {
          background: 'linear-gradient(135deg, #f59e0b, #eab308)',
          color: 'white',
          padding: '1rem',
          borderRadius: '9999px',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.4)',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          animation: 'solar-pulse 2s infinite'
        }
      }, React.createElement(Sun, { size: 24 })),
      React.createElement('div', {
        key: 'badge',
        style: {
          position: 'absolute',
          top: '-0.5rem',
          left: '-0.5rem',
          background: 'linear-gradient(135deg, #059669, #10b981)',
          color: 'white',
          fontSize: '0.75rem',
          borderRadius: '9999px',
          height: '1.5rem',
          width: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'bounce 1s infinite',
          fontWeight: 'bold'
        }
      }, '💬')
    ]);
  }

  const welcomeOptions = [
    { 
      icon: Calculator, 
      text: "Calculate Solar Savings", 
      description: "See how much you can save",
      value: "I want to calculate my solar savings", 
      action: "calculate",
      color: "#059669"
    },
    { 
      icon: FileText, 
      text: "Learn About Solar", 
      description: "Georgia benefits & process",
      value: "I want to learn about solar energy", 
      action: "learn",
      color: "#2563eb"
    },
    { 
      icon: Phone, 
      text: "Speak with Expert", 
      description: "Free consultation",
      value: "I want to speak with a solar expert", 
      action: "contact",
      color: "#7c3aed"
    },
    { 
      icon: Zap, 
      text: "Emergency Service", 
      description: "24/7 repair support",
      value: "I need emergency solar service", 
      action: "emergency",
      color: "#dc2626"
    }
  ];

  return React.createElement('div', {
    className: "fixed bottom-4 right-4 z-50",
    style: {
      position: 'fixed',
      bottom: '1rem',
      right: '1rem',
      zIndex: 9999,
      width: '28rem',
      maxWidth: 'calc(100vw - 2rem)'
    }
  }, React.createElement('div', {
    style: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }
  }, [
    // Header
    React.createElement('div', {
      key: 'header',
      style: {
        background: 'linear-gradient(135deg, #f59e0b, #eab308)',
        color: 'white',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, [
      React.createElement('div', {
        key: 'header-content',
        style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }
      }, [
        React.createElement('div', {
          key: 'avatar',
          style: {
            width: '3rem',
            height: '3rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.25rem'
          }
        }, '☀️'),
        React.createElement('div', { key: 'title' }, [
          React.createElement('h3', {
            key: 'h3',
            style: { fontWeight: '600', margin: 0, fontSize: '1.1rem' }
          }, 'EkoBot - Solar Assistant'),
          React.createElement('p', {
            key: 'p',
            style: { color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', margin: 0 }
          }, 'Georgia Solar Expert Online'),
          React.createElement('div', {
            key: 'status',
            style: { 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem', 
              marginTop: '0.25rem',
              fontSize: '0.75rem'
            }
          }, [
            React.createElement('div', {
              key: 'indicator',
              style: {
                width: '0.5rem',
                height: '0.5rem',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }
            }),
            'Online & Ready to Help'
          ])
        ])
      ]),
      React.createElement('button', {
        key: 'close',
        onClick: () => setIsOpen(false),
        style: {
          color: 'white',
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          transition: 'background 0.2s'
        }
      }, React.createElement(X, { size: 20 }))
    ]),

    // Messages
    React.createElement('div', {
      key: 'messages',
      style: {
        height: '28rem',
        overflowY: 'auto',
        padding: '1.25rem',
        background: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }
    }, [
      ...messages.map((message) => React.createElement('div', {
        key: message.id,
        style: {
          display: 'flex',
          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
          alignItems: 'flex-end',
          gap: '0.5rem'
        }
      }, [
        message.sender === 'bot' && React.createElement('div', {
          key: 'avatar',
          style: {
            width: '2rem',
            height: '2rem',
            background: 'linear-gradient(135deg, #f59e0b, #eab308)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.875rem',
            flexShrink: 0
          }
        }, '☀️'),
        React.createElement('div', {
          key: 'message',
          style: {
            maxWidth: '85%',
            padding: '1rem',
            borderRadius: message.sender === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
            background: message.sender === 'user' ? 
              'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'white',
            color: message.sender === 'user' ? 'white' : '#1f2937',
            boxShadow: message.sender === 'bot' ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 
              '0 2px 8px rgba(37, 99, 235, 0.2)',
            border: message.sender === 'bot' ? '1px solid #e5e7eb' : 'none'
          }
        }, [
          React.createElement('p', {
            key: 'text',
            style: {
              whiteSpace: 'pre-line',
              fontSize: '0.9rem',
              margin: 0,
              lineHeight: 1.5
            }
          }, message.text),
          message.options && React.createElement('div', {
            key: 'options',
            style: { 
              marginTop: '1rem', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.5rem' 
            }
          }, message.options.map((option, index) => React.createElement('button', {
            key: index,
            onClick: () => handleQuickAction(option.action, option.text),
            style: {
              width: '100%',
              textAlign: 'left',
              padding: '0.75rem',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '0.5rem',
              color: '#1d4ed8',
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: '500'
            },
            onMouseOver: (e) => {
              e.target.style.background = '#dbeafe';
              e.target.style.transform = 'translateY(-1px)';
            },
            onMouseOut: (e) => {
              e.target.style.background = '#eff6ff';
              e.target.style.transform = 'translateY(0)';
            }
          }, option.text)))
        ])
      ])),

      // Typing indicator
      isTyping && React.createElement('div', {
        key: 'typing',
        style: { display: 'flex', justifyContent: 'flex-start' }
      }, TypingIndicator()),

      // Welcome options
      messages.length === 1 && currentFlow === 'welcome' && !isTyping && React.createElement('div', {
        key: 'welcome-options',
        style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }
      }, welcomeOptions.map((option, index) => React.createElement('button', {
        key: index,
        onClick: () => handleQuickAction(option.action, option.value),
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '1rem',
          background: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '0.75rem',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          minHeight: '5rem'
        },
        onMouseOver: (e) => {
          e.target.style.borderColor = option.color;
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
        },
        onMouseOut: (e) => {
          e.target.style.borderColor = '#e5e7eb';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = 'none';
        }
      }, [
        React.createElement(option.icon, { 
          key: 'icon', 
          size: 24, 
          style: { color: option.color } 
        }),
        React.createElement('div', { key: 'text' }, [
          React.createElement('div', {
            key: 'title',
            style: { 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.25rem'
            }
          }, option.text),
          React.createElement('div', {
            key: 'desc',
            style: { 
              fontSize: '0.75rem',
              color: '#6b7280'
            }
          }, option.description)
        ])
      ]))),

      React.createElement('div', { key: 'scroll-anchor', ref: messagesEndRef })
    ]),

    // Input
    React.createElement('div', {
      key: 'input',
      style: {
        padding: '1.25rem',
        borderTop: '1px solid #e5e7eb',
        background: 'white'
      }
    }, [
      React.createElement('div', {
        key: 'input-container',
        style: { display: 'flex', gap: '0.75rem' }
      }, [
        React.createElement('input', {
          key: 'input-field',
          type: 'text',
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyPress: (e) => e.key === 'Enter' && handleSendMessage(),
          placeholder: 'Ask about solar savings, costs, or installation...',
          style: {
            flex: 1,
            padding: '0.75rem',
            border: '2px solid #e5e7eb',
            borderRadius: '0.75rem',
            outline: 'none',
            fontSize: '0.875rem',
            transition: 'border-color 0.2s'
          },
          onFocus: (e) => e.target.style.borderColor = '#f59e0b',
          onBlur: (e) => e.target.style.borderColor = '#e5e7eb'
        }),
        React.createElement('button', {
          key: 'send-btn',
          onClick: handleSendMessage,
          disabled: !inputValue.trim(),
          style: {
            background: inputValue.trim() ? 
              'linear-gradient(135deg, #f59e0b, #eab308)' : '#d1d5db',
            color: 'white',
            padding: '0.75rem',
            border: 'none',
            borderRadius: '0.75rem',
            cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            opacity: inputValue.trim() ? 1 : 0.6
          }
        }, React.createElement(Send, { size: 18 }))
      ]),
      React.createElement('div', {
        key: 'footer',
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '0.75rem',
          fontSize: '0.75rem',
          color: '#6b7280'
        }
      }, [
        React.createElement('div', {
          key: 'rating',
          style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
        }, [
          React.createElement('div', {
            key: 'stars',
            style: { display: 'flex', alignItems: 'center', gap: '0.25rem' }
          }, [
            ...Array(5).fill().map((_, i) => 
              React.createElement(Star, { 
                key: i, 
                size: 12, 
                style: { color: '#eab308', fill: '#eab308' } 
              })
            )
          ]),
          '4.9/5 Rating • 500+ Happy Customers'
        ]),
        React.createElement('div', {
          key: 'phone',
          style: { 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.25rem',
            fontWeight: '600',
            color: '#374151'
          }
        }, [
          React.createElement(Phone, { key: 'phone-icon', size: 12 }),
          '(404) 364-5456'
        ])
      ])
    ])
  ]));
};

// Render the component with error handling and modern React
function initializeChatbot() {
  try {
    const container = document.getElementById('solar-chatbot');
    if (container && typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
      console.log('✅ Initializing EkoSolar Chatbot...');
      
      // Use modern React 18 createRoot if available, fallback to legacy render
      if (ReactDOM.createRoot) {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(EkoSolarChatbot));
      } else {
        ReactDOM.render(React.createElement(EkoSolarChatbot), container);
      }
      
      console.log('✅ EkoSolar Chatbot initialized successfully');
    } else {
      console.error('❌ Chatbot initialization failed:', {
        container: !!container,
        React: typeof React,
        ReactDOM: typeof ReactDOM,
        LucideReact: typeof LucideReact
      });
    }
  } catch (error) {
    console.error('❌ Chatbot error:', error);
  }
}

// Initialize when DOM is ready and dependencies are loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
  // DOM already loaded, try immediately or wait a bit for dependencies
  if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
    initializeChatbot();
  } else {
    // Wait for dependencies to load
    setTimeout(initializeChatbot, 100);
  }
}

// Add required CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes solar-pulse {
    0%, 100% { 
      opacity: 1; 
      box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4);
    }
    50% { 
      opacity: 0.8; 
      box-shadow: 0 15px 35px -5px rgba(245, 158, 11, 0.6);
    }
  }
  @keyframes bounce {
    0%, 100% { 
      transform: translateY(-25%); 
      animation-timing-function: cubic-bezier(0.8,0,1,1); 
    }
    50% { 
      transform: none; 
      animation-timing-function: cubic-bezier(0,0,0.2,1); 
    }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes typing-dot {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

console.log('🤖 EkoSolar AI Chatbot loaded successfully!');