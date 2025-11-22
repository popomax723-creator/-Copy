
import React, { useState, useEffect } from 'react';
import { User, Product, Order, UserRole, OrderStatus, AdminStatus, ProductCategory, CartItem, Notification } from './types';
import { AdminPanel } from './components/AdminPanel';
import { ProductCard } from './components/ProductCard';
import { Button } from './components/Button';
import { HomeView } from './components/HomeView';
import { ChatBot } from './components/ChatBot';
import { CategoryPage } from './components/CategoryPage';
import { ProductModal } from './components/ProductModal';
import { ShoppingCart, User as UserIcon, Menu, X, Settings, MapPin, Phone, LogIn, Sparkles, Home, ShoppingBag, Heart, Gift, Bell } from 'lucide-react';

// --- Mock Data ---
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'تفاح أحمر طازج', category: ProductCategory.FRUITS_VEG, price: 8.5, stock: 50, imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&q=80&w=300', description: 'تفاح أحمر مقرمش وحلو المذاق 🍎' },
  { id: '2', name: 'لحم عجل محلي', category: ProductCategory.MEAT, price: 45.0, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1603048297172-c92544798d5e?auto=format&fit=crop&q=80&w=300', description: 'لحم عجل طازج وعالي الجودة 🥩' },
  { id: '3', name: 'عصير برتقال طبيعي', category: ProductCategory.JUICES, price: 12.0, stock: 25, discount: 10, isOffer: true, imageUrl: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=300' },
  { id: '4', name: 'بسكويت الشوكولاتة', category: ProductCategory.BISCUITS, price: 5.0, stock: 100, imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=300' },
  { id: '5', name: 'شامبو للشعر', category: ProductCategory.PERSONAL_CARE, price: 18.0, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1585232351009-140ca480695d?auto=format&fit=crop&q=80&w=300' },
  { id: '6', name: 'كيك الشوكولاتة', category: ProductCategory.CAKE, price: 25.0, stock: 15, imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=300' },
  { id: '7', name: 'منظف أسطح', category: ProductCategory.CLEANING, price: 15.0, stock: 40, imageUrl: 'https://images.unsplash.com/photo-1585421514738-01798e148061?auto=format&fit=crop&q=80&w=300' },
  { id: '8', name: 'مشروب غازي', category: ProductCategory.DRINKS, price: 3.0, stock: 200, imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=300' },
  { id: '9', name: 'موز طازج', category: ProductCategory.FRUITS_VEG, price: 5.5, stock: 60, imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=300' },
  { id: '10', name: 'دجاج كامل', category: ProductCategory.MEAT, price: 22.0, stock: 30, imageUrl: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&q=80&w=300' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
    { id: '1', message: 'خصم 50% على الفواكه والخضروات كل يوم جمعة!', date: new Date(Date.now() - 86400000).toISOString() },
    { id: '2', message: 'تم وصول تشكيلة جديدة من الأجبان المستوردة 🧀', date: new Date(Date.now() - 172800000).toISOString() },
];

const MAIN_ADMIN: User = {
  id: 'admin-main',
  name: 'ملاك',
  email: 'malakpubglite056@gmail.com',
  password: 'malakpubglite',
  role: UserRole.ADMIN,
  status: AdminStatus.ACCEPTED
};

const MOTIVATIONAL_PHRASES = [
  "استمتع بتجربة التسوق لدينا – أفضل العروض تنتظرك! ✨",
  "منتجات طازجة وبأفضل الأسعار فقط في سوبر ماركت الشارقة! 🥦",
  "تسوق أكثر، وفر أكثر! اكتشف عروضنا المميزة اليوم! 💸",
  "اختيار رائع! أضفنا هذا المنتج المميز لسلتك 🌟",
  "صحة وعافية! منتجاتنا مضمونة الجودة 💯"
];

function App() {
  // --- State ---
  const [view, setView] = useState<'home' | 'cart' | 'profile' | 'login' | 'admin' | 'category_view'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [admins, setAdmins] = useState<User[]>([MAIN_ADMIN]);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  // Navigation State
  const [selectedCategoryPage, setSelectedCategoryPage] = useState<ProductCategory | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');

  // Profile Edit
  const [tempProfile, setTempProfile] = useState<Partial<User>>({});

  // Init
  useEffect(() => {
    const storedUser = localStorage.getItem('sharjah_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // --- Actions ---

  const showMotivationalToast = () => {
    const msg = MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
    const toast = document.createElement('div');
    // Neon style toast with glowing text
    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]">${msg}</span>
      </div>
    `;
    toast.className = `
      fixed bottom-24 right-4 md:right-8 z-[60] 
      bg-[#0C612D]/90 backdrop-blur-md text-[#F68B1F] 
      px-6 py-4 rounded-2xl shadow-[0_0_20px_rgba(12,97,45,0.6)] 
      border border-[#F68B1F]/40
      font-bold text-sm md:text-base animate-bounce
      text-shadow-sm
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        toast.style.transition = 'all 0.5s ease';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const admin = admins.find(a => a.email === loginEmail && a.password === loginPass);
    
    if (admin) {
        if (admin.status === AdminStatus.ACCEPTED) {
            setCurrentUser(admin);
            localStorage.setItem('sharjah_user', JSON.stringify(admin));
            setView('admin');
            setLoginError('');
        } else {
            setLoginError('حسابك غير مصرح بالدخول (Status: ' + admin.status + ')');
        }
    } else {
        setLoginError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sharjah_user');
    setView('home');
    setLoginEmail('');
    setLoginPass('');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showMotivationalToast();
  };

  const updateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
        if (item.id === id) {
            return { ...item, quantity: Math.max(1, item.quantity + delta) };
        }
        return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const placeOrder = () => {
    if (!currentUser && !tempProfile.name) {
        alert("يرجى إكمال بيانات الملف الشخصي (الاسم، الجوال، والموقع) لإتمام الطلب");
        setView('profile');
        return;
    }

    const nameToUse = currentUser?.name || tempProfile.name;
    const phoneToUse = currentUser?.phone || tempProfile.phone;
    const locToUse = currentUser?.location || tempProfile.location;

    if (!nameToUse || !phoneToUse || !locToUse) {
         alert("يرجى التأكد من تعبئة الاسم ورقم الجوال والموقع في صفحة الإعدادات");
         setView('profile');
         return;
    }
    
    const newOrder: Order = {
        id: crypto.randomUUID(),
        userId: currentUser?.id || 'guest',
        customerName: nameToUse,
        customerPhone: phoneToUse,
        customerLocation: locToUse,
        items: [...cart],
        total: cart.reduce((sum, i) => {
            const price = i.discount ? i.price * (1 - i.discount/100) : i.price;
            return sum + (price * i.quantity);
        }, 0),
        status: OrderStatus.PREPARING,
        date: new Date().toISOString()
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setView('home');
    
    // Success Modal
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-auto animate-pulse border-4 border-[#F68B1F]">
            <div class="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-10 h-10 text-[#0C612D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-[#0C612D] mb-2">تم استلام طلبك بنجاح!</h3>
            <p class="text-gray-600 mb-4">شكراً لتسوقك معنا في سوبر ماركت الشارقة. سنبدأ بتجهيز طلبك فوراً.</p>
            <p class="text-[#F68B1F] font-bold text-lg animate-bounce drop-shadow-[0_0_8px_rgba(246,139,31,0.5)]">تسوق أكثر، وفر أكثر! 🧡</p>
        </div>
    `;
    modal.className = "fixed inset-0 bg-black/60 z-[70] flex items-center justify-center p-4 backdrop-blur-sm";
    document.body.appendChild(modal);
    setTimeout(() => modal.remove(), 4000);
    showMotivationalToast();
  };

  const handleSendNotification = (message: string) => {
      const newNotif: Notification = {
          id: crypto.randomUUID(),
          message,
          date: new Date().toISOString()
      };
      setNotifications([newNotif, ...notifications]);
  };

  // --- Components Views ---

  const renderNavbar = () => (
    <nav className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-40 border-b border-[#F68B1F]/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                <div className="bg-gradient-to-br from-[#F68B1F] to-orange-600 p-2 rounded-xl shadow-lg shadow-orange-200">
                    <Home className="text-white w-6 h-6" />
                </div>
                <h1 className="text-xl font-extrabold text-[#0C612D] hidden md:block tracking-tight">سوبر ماركت الشارقة</h1>
            </div>

            <div className="flex items-center gap-4">
                {currentUser?.role === UserRole.ADMIN && (
                     <button onClick={() => setView('admin')} className="text-xs bg-[#0C612D] text-white px-3 py-1.5 rounded-full hover:bg-green-800 shadow-md transition">
                        لوحة التحكم
                     </button>
                )}

                <button onClick={() => setView('cart')} className="relative p-2 text-gray-600 hover:text-[#F68B1F] transition-colors">
                    <ShoppingCart className="w-6 h-6" />
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 bg-[#F68B1F] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-sm">
                            {cart.length}
                        </span>
                    )}
                </button>

                <button onClick={() => setView(currentUser ? 'profile' : 'login')} className="p-2 text-gray-600 hover:text-[#F68B1F] transition-colors">
                    <UserIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    </nav>
  );

  if (view === 'admin' && currentUser?.role === UserRole.ADMIN) {
    return (
        <AdminPanel 
            currentUser={currentUser}
            allProducts={products}
            allOrders={orders}
            allAdmins={admins}
            notifications={notifications}
            onLogout={handleLogout}
            onUpdateProduct={(p) => {
                setProducts(prev => {
                    const exists = prev.find(x => x.id === p.id);
                    return exists ? prev.map(x => x.id === p.id ? p : x) : [...prev, p];
                });
            }}
            onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
            onUpdateOrder={(id, status) => setOrders(prev => prev.map(o => o.id === id ? {...o, status} : o))}
            onUpdateAdminStatus={(id, status) => setAdmins(prev => prev.map(a => a.id === id ? {...a, status} : a))}
            onAddAdmin={(user) => setAdmins([...admins, user])}
            onSendNotification={handleSendNotification}
        />
    );
  }

  if (view === 'login') {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border-t-8 border-[#F68B1F]">
                <div className="text-center mb-8">
                    <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-10 h-10 text-[#0C612D]" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#0C612D] mb-2">تسجيل الدخول للمسؤولين</h1>
                    <p className="text-gray-500 text-sm">لوحة تحكم سوبر ماركت الشارقة</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">{loginError}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                        <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl ltr text-left focus:ring-2 focus:ring-[#F68B1F] outline-none" placeholder="admin@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
                        <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} className="w-full border border-gray-200 p-3 rounded-xl ltr text-left focus:ring-2 focus:ring-[#F68B1F] outline-none" placeholder="••••••" />
                    </div>
                    <Button type="submit" className="w-full h-12 text-lg rounded-xl shadow-lg shadow-orange-100">دخول</Button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <button onClick={() => setView('home')} className="text-sm text-gray-500 hover:text-[#0C612D] font-medium transition-colors">العودة للتسوق كزبون</button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      {renderNavbar()}

      {/* Product Modal Overlay */}
      {selectedProduct && (
          <ProductModal 
            product={selectedProduct} 
            allProducts={products}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={(p) => { addToCart(p); setSelectedProduct(null); }}
            onSelectProduct={setSelectedProduct}
          />
      )}

      {view === 'home' && (
        <main className="max-w-7xl mx-auto pb-20">
            {/* Show Latest Notification Banner */}
            {notifications.length > 0 && (
                <div className="bg-[#0C612D] text-white text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2 animate-pulse shadow-md">
                    <Bell className="w-4 h-4" />
                    {notifications[0].message}
                </div>
            )}
            
            <HomeView 
                products={products}
                onAddToCart={addToCart}
                onOpenCategory={(cat) => { setSelectedCategoryPage(cat); setView('category_view'); }}
                onProductClick={setSelectedProduct}
            />
        </main>
      )}

      {view === 'category_view' && selectedCategoryPage && (
          <CategoryPage 
            category={selectedCategoryPage}
            products={products}
            onBack={() => setView('home')}
            onAddToCart={addToCart}
            onProductClick={setSelectedProduct}
          />
      )}

      {view === 'cart' && (
        <main className="max-w-3xl mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 text-[#0C612D] flex items-center gap-2">
                <ShoppingBag className="w-6 h-6" /> سلة المشتريات
            </h2>
            {cart.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
                    <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-10 h-10 text-[#F68B1F]" />
                    </div>
                    <p className="text-gray-500 text-lg mb-4">السلة فارغة حالياً</p>
                    <Button onClick={() => setView('home')}>تصفح المنتجات</Button>
                </div>
            ) : (
                <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-50">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between py-6 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-4">
                                <img src={item.imageUrl} className="w-20 h-20 object-contain rounded-2xl bg-gray-50 border border-gray-100" />
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                                    <div className="text-[#0C612D] font-bold mt-1">
                                        {(item.discount ? item.price * (1 - item.discount/100) : item.price).toFixed(2)} ريال
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-3 bg-gray-50 rounded-full p-1">
                                    <button onClick={() => updateCartQty(item.id, -1)} className="w-8 h-8 rounded-full bg-white shadow-sm text-gray-600 flex items-center justify-center hover:bg-gray-100">-</button>
                                    <span className="font-bold w-6 text-center">{item.quantity}</span>
                                    <button onClick={() => updateCartQty(item.id, 1)} className="w-8 h-8 rounded-full bg-white shadow-sm text-gray-600 flex items-center justify-center hover:bg-gray-100">+</button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-sm flex items-center gap-1"><X className="w-3 h-3" /> حذف</button>
                            </div>
                        </div>
                    ))}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-8">
                            <span className="text-gray-500">المجموع الكلي</span>
                            <span className="text-3xl font-bold text-[#F68B1F]">
                                {cart.reduce((sum, i) => {
                                    const p = i.discount ? i.price * (1 - i.discount/100) : i.price;
                                    return sum + (p * i.quantity);
                                }, 0).toFixed(2)} ريال
                            </span>
                        </div>
                        <Button onClick={placeOrder} className="w-full py-4 text-lg rounded-2xl shadow-xl shadow-orange-100">
                            تأكيد الطلب الآن 🛍️
                        </Button>
                    </div>
                </div>
            )}
        </main>
      )}

      {view === 'profile' && (
        <main className="max-w-lg mx-auto px-4 py-8">
             <h2 className="text-2xl font-bold mb-6 text-[#0C612D] flex items-center gap-2"><Settings className="w-6 h-6" /> بياناتي</h2>
             <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-50 space-y-6">
                <p className="text-sm text-gray-500 mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                    يرجى تعبئة البيانات التالية بدقة لتوصيل الطلب إلى موقعك الصحيح.
                </p>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الاسم الكامل</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0C612D] outline-none transition-colors" 
                        value={tempProfile.name || currentUser?.name || ''} 
                        onChange={e => setTempProfile({...tempProfile, name: e.target.value})}
                        placeholder="الاسم"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">رقم الجوال</label>
                    <input 
                        type="tel" 
                        className="w-full border border-gray-200 p-3 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0C612D] outline-none transition-colors text-left ltr" 
                        value={tempProfile.phone || currentUser?.phone || ''} 
                        onChange={e => setTempProfile({...tempProfile, phone: e.target.value})}
                        placeholder="05xxxxxxxx"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الموقع (الشارقة)</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                        <input 
                            type="text" 
                            className="w-full border border-gray-200 p-3 pl-10 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#0C612D] outline-none transition-colors" 
                            value={tempProfile.location || currentUser?.location || ''} 
                            onChange={e => setTempProfile({...tempProfile, location: e.target.value})}
                            placeholder="حدد موقعك (مثال: المجاز 3، بناية النور...)"
                        />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">سيستخدم السائق هذا الموقع لتوصيل طلبك.</p>
                </div>
                <Button onClick={() => {
                    const updated = { 
                        ...currentUser, 
                        ...tempProfile,
                        id: currentUser?.id || 'guest-id',
                        role: currentUser?.role || UserRole.CUSTOMER
                    } as User;
                    setCurrentUser(updated);
                    localStorage.setItem('sharjah_user', JSON.stringify(updated));
                    alert('تم حفظ البيانات بنجاح ✅');
                }} className="w-full mt-2 py-3 rounded-xl">حفظ البيانات</Button>

                {currentUser && (
                    <button onClick={handleLogout} className="w-full py-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition font-medium">تسجيل الخروج</button>
                )}
             </div>
        </main>
      )}
      
      {/* ChatBot Global */}
      <ChatBot products={products} onAddToCart={addToCart} />
    </div>
  );
}

export default App;
