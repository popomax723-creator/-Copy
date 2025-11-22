import React, { useState, useEffect } from 'react';
import { User, Product, Order, OrderStatus, AdminStatus, ProductCategory, UserRole, Notification } from '../types';
import { Button } from './Button';
import { generateProductDescription } from '../services/geminiService';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Plus, 
  Search, 
  MapPin, 
  Trash2, 
  Edit, 
  Sparkles, 
  CheckCircle, 
  XCircle,
  LogOut,
  Bell,
  Send,
  Tag,
  TrendingUp,
  Wallet,
  Clock
} from 'lucide-react';

interface AdminPanelProps {
  currentUser: User;
  allProducts: Product[];
  allOrders: Order[];
  allAdmins: User[];
  notifications: Notification[];
  onLogout: () => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrder: (orderId: string, status: OrderStatus) => void;
  onUpdateAdminStatus: (adminId: string, status: AdminStatus) => void;
  onAddAdmin: (user: User) => void;
  onSendNotification: (message: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  currentUser,
  allProducts,
  allOrders,
  allAdmins,
  notifications,
  onLogout,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrder,
  onUpdateAdminStatus,
  onAddAdmin,
  onSendNotification
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'admins' | 'offers' | 'notifications'>('products');
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [isRegisteringAdmin, setIsRegisteringAdmin] = useState<boolean>(false);
  
  // Product Form State
  const [editProduct, setEditProduct] = useState<Partial<Product>>({});
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Admin Form State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', status: AdminStatus.PENDING });

  // Notification State
  const [isSendingNotification, setIsSendingNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Handlers
  const handleSaveProduct = () => {
    if (!editProduct.name || !editProduct.price || !editProduct.category) return;
    
    // Check if it's a new offer or significantly changed discount
    const previousProduct = allProducts.find(p => p.id === editProduct.id);
    const newDiscount = Number(editProduct.discount) || 0;
    const oldDiscount = previousProduct?.discount || 0;
    const isNewOffer = newDiscount > 0 && (newDiscount !== oldDiscount);

    const productToSave: Product = {
      id: editProduct.id || crypto.randomUUID(),
      name: editProduct.name,
      category: editProduct.category,
      price: Number(editProduct.price),
      stock: Number(editProduct.stock) || 0,
      discount: newDiscount,
      imageUrl: editProduct.imageUrl || `https://picsum.photos/seed/${Math.random()}/300/300`,
      description: editProduct.description,
      isOffer: newDiscount > 0
    };
    
    onUpdateProduct(productToSave);
    setIsEditingProduct(false);
    setEditProduct({});
    
    // Automatic Notification Logic
    if (isNewOffer) {
        onSendNotification(`🔥 عرض جديد! خصم ${newDiscount}% على ${productToSave.name}. لا تفوت الفرصة!`);
    } else if (!editProduct.id) {
        // Optional: Notify on new product
        // onSendNotification(`🆕 منتج جديد: ${productToSave.name} متوفر الآن في المتجر!`);
    }
  };

  const handleAIGenerate = async () => {
    if (!editProduct.name || !editProduct.category) {
        alert('يرجى إدخال اسم المنتج والقسم أولاً');
        return;
    }
    setIsGeneratingAI(true);
    const desc = await generateProductDescription(editProduct.name, editProduct.category);
    setEditProduct(prev => ({ ...prev, description: desc }));
    setIsGeneratingAI(false);
  };

  const handleSaveAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) return;
    
    const adminToAdd: User = {
        id: crypto.randomUUID(),
        name: newAdmin.name,
        email: newAdmin.email,
        password: newAdmin.password,
        role: UserRole.ADMIN,
        status: newAdmin.status
    };
    onAddAdmin(adminToAdd);
    setIsRegisteringAdmin(false);
    setNewAdmin({ name: '', email: '', password: '', status: AdminStatus.PENDING });
  };

  const handleSendNotif = () => {
      if (!notificationMessage.trim()) return;
      onSendNotification(notificationMessage);
      setNotificationMessage('');
      setIsSendingNotification(false);
  };

  const handleOrderStatusUpdate = (order: Order, newStatus: OrderStatus) => {
      onUpdateOrder(order.id, newStatus);
      // Automatically send notification to the customer (Simulated here as a global notification for demo purposes)
      // In a real app, this would be a specific push notification to order.userId
      onSendNotification(`🔔 تحديث طلب #${order.id.slice(0,4)}: حالتك الآن "${newStatus}"`);
  };

  // Calculations for Dashboard
  const totalRevenue = allOrders.reduce((acc, order) => acc + order.total, 0);
  const totalOrdersCount = allOrders.length;
  const pendingOrdersCount = allOrders.filter(o => o.status === OrderStatus.PREPARING || o.status === OrderStatus.ON_WAY).length;

  // Render helpers
  const renderProductForm = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#0C612D] mb-4">
                {editProduct.id ? 'تعديل منتج' : 'إضافة منتج جديد'}
            </h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-[#F68B1F] outline-none"
                        value={editProduct.name || ''}
                        onChange={e => setEditProduct({...editProduct, name: e.target.value})}
                    />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">القسم</label>
                        <select 
                            className="w-full border border-gray-300 rounded-lg p-2 outline-none"
                            value={editProduct.category || ''}
                            onChange={e => setEditProduct({...editProduct, category: e.target.value as ProductCategory})}
                        >
                            <option value="">اختر القسم</option>
                            {Object.values(ProductCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ريال)</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-2 outline-none"
                            value={editProduct.price || ''}
                            onChange={e => setEditProduct({...editProduct, price: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">المخزون</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-2 outline-none"
                            value={editProduct.stock || ''}
                            onChange={e => setEditProduct({...editProduct, stock: Number(e.target.value)})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">الخصم (%)</label>
                        <input 
                            type="number" 
                            className="w-full border border-gray-300 rounded-lg p-2 outline-none"
                            value={editProduct.discount || ''}
                            onChange={e => setEditProduct({...editProduct, discount: Number(e.target.value)})}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">رابط الصورة (اختياري)</label>
                    <input 
                        type="text" 
                        placeholder="https://example.com/image.jpg"
                        className="w-full border border-gray-300 rounded-lg p-2 outline-none text-left ltr"
                        value={editProduct.imageUrl || ''}
                        onChange={e => setEditProduct({...editProduct, imageUrl: e.target.value})}
                    />
                </div>

                {/* Gemini Feature */}
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-bold text-[#F68B1F] flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> وصف الذكاء الاصطناعي (Gemini)
                        </label>
                        <button 
                            onClick={handleAIGenerate}
                            disabled={isGeneratingAI}
                            className="text-xs bg-[#F68B1F] text-white px-3 py-1 rounded-full hover:bg-[#d97817] disabled:opacity-50"
                        >
                            {isGeneratingAI ? 'جاري التوليد...' : 'توليد وصف تلقائي'}
                        </button>
                    </div>
                    <textarea 
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg p-2 outline-none text-sm"
                        value={editProduct.description || ''}
                        onChange={e => setEditProduct({...editProduct, description: e.target.value})}
                        placeholder="اضغط على زر التوليد ليقوم Gemini بكتابة وصف جذاب..."
                    />
                </div>

                <div className="flex gap-3 mt-6">
                    <Button onClick={handleSaveProduct} className="flex-1">حفظ التغييرات</Button>
                    <Button variant="outline" onClick={() => setIsEditingProduct(false)} className="flex-1">إلغاء</Button>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0C612D] text-white hidden md:flex flex-col p-6 fixed h-full right-0 shadow-2xl">
        <div className="mb-8 border-b border-green-700 pb-4">
            <h1 className="text-2xl font-bold tracking-tight">لوحة التحكم</h1>
            <p className="text-sm text-green-200 mt-1">أهلاً، {currentUser.name}</p>
        </div>

        <nav className="space-y-2 flex-1">
            <button 
                onClick={() => setActiveTab('products')} 
                className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'products' ? 'bg-[#F68B1F] shadow-lg shadow-orange-900/20' : 'hover:bg-white/10'}`}
            >
                <Package className="w-5 h-5" /> المنتجات
            </button>
            <button 
                onClick={() => setActiveTab('offers')} 
                className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'offers' ? 'bg-[#F68B1F] shadow-lg shadow-orange-900/20' : 'hover:bg-white/10'}`}
            >
                <Tag className="w-5 h-5" /> العروض
            </button>
            <button 
                onClick={() => setActiveTab('orders')} 
                className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-[#F68B1F] shadow-lg shadow-orange-900/20' : 'hover:bg-white/10'}`}
            >
                <ShoppingBag className="w-5 h-5" /> الطلبات
            </button>
             {/* Only Malak (Main Admin) sees this */}
            {currentUser.email === 'malakpubglite056@gmail.com' && (
                <button 
                    onClick={() => setActiveTab('admins')} 
                    className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'admins' ? 'bg-[#F68B1F] shadow-lg shadow-orange-900/20' : 'hover:bg-white/10'}`}
                >
                    <Users className="w-5 h-5" /> المسؤولين
                </button>
            )}
             <button 
                onClick={() => setActiveTab('notifications')} 
                className={`w-full text-right p-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'notifications' ? 'bg-[#F68B1F] shadow-lg shadow-orange-900/20' : 'hover:bg-white/10'}`}
            >
                <Bell className="w-5 h-5" /> الإشعارات
            </button>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-2 text-red-200 hover:text-white mt-auto py-2">
            <LogOut className="w-5 h-5" /> تسجيل الخروج
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:mr-64 p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
             <h1 className="font-bold text-[#0C612D]">لوحة التحكم</h1>
             <button onClick={onLogout}><LogOut className="text-red-500" /></button>
        </div>

        {activeTab === 'products' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">إدارة المنتجات</h2>
                    <Button onClick={() => { setEditProduct({}); setIsEditingProduct(true); }}>
                        <Plus className="w-5 h-5" /> إضافة منتج
                    </Button>
                </div>
                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="p-4 text-gray-600">المنتج</th>
                                    <th className="p-4 text-gray-600">القسم</th>
                                    <th className="p-4 text-gray-600">السعر</th>
                                    <th className="p-4 text-gray-600">المخزون</th>
                                    <th className="p-4 text-gray-600">الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allProducts.map(p => (
                                    <tr key={p.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 flex items-center gap-3">
                                            <img src={p.imageUrl} className="w-10 h-10 rounded object-cover bg-gray-200" />
                                            <span className="font-medium">{p.name}</span>
                                        </td>
                                        <td className="p-4 text-gray-600">{p.category}</td>
                                        <td className="p-4 font-bold text-[#0C612D]">{p.price} ريال</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${p.stock > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {p.stock > 0 ? p.stock : 'نفذت الكمية'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => { setEditProduct(p); setIsEditingProduct(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit className="w-4 h-4" /></button>
                                                <button onClick={() => onDeleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'orders' && (
            <div>
                 <h2 className="text-2xl font-bold text-gray-800 mb-6">نظام إدارة الطلبات</h2>
                 
                 {/* Financial Dashboard (Only visible in Admin Panel) */}
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">إجمالي المبيعات (Revenue)</p>
                            <h3 className="text-3xl font-bold text-[#0C612D]">{totalRevenue.toFixed(2)} ريال</h3>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-[#0C612D]">
                            <Wallet className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">عدد الطلبات الكلي</p>
                            <h3 className="text-3xl font-bold text-gray-800">{totalOrdersCount}</h3>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">طلبات قيد التنفيذ</p>
                            <h3 className="text-3xl font-bold text-[#F68B1F]">{pendingOrdersCount}</h3>
                        </div>
                        <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-[#F68B1F]">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                 </div>

                 <div className="grid gap-4">
                    {allOrders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <p className="text-gray-500">لا توجد طلبات حتى الآن.</p>
                        </div>
                    ) : (
                        allOrders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-wrap justify-between items-start mb-4 gap-4">
                                    <div>
                                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                                            {order.customerName} 
                                            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                {order.customerPhone}
                                            </span>
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                            <MapPin className="w-4 h-4 text-[#F68B1F]" /> 
                                            {order.customerLocation}
                                            <a 
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.customerLocation)}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="text-blue-600 underline text-xs mr-2 font-medium"
                                            >
                                                (عرض الموقع على الخريطة)
                                            </a>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-1">
                                            {new Date(order.date).toLocaleString('ar-EG')}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-sm
                                            ${order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-700' : 
                                            order.status === OrderStatus.ON_WAY ? 'bg-blue-100 text-blue-700 animate-pulse' : 'bg-orange-100 text-orange-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                                    <h4 className="font-bold text-sm text-gray-700 mb-3 border-b border-gray-200 pb-2 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-gray-400" /> المنتجات المطلوبة:
                                    </h4>
                                    <ul className="space-y-3">
                                        {order.items.map((item, idx) => (
                                            <li key={idx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-[#0C612D] text-white rounded px-2 py-1 text-xs font-bold shadow-sm">
                                                        {item.quantity}x
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-800 text-sm block">{item.name}</span>
                                                        <span className="text-xs text-gray-500">سعر الوحدة: {item.price} ريال</span>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-gray-800">{(item.price * item.quantity).toFixed(2)} ريال</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="border-t border-gray-200 mt-4 pt-3 flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100">
                                        <span className="text-gray-600 font-bold">المجموع المستحق من الزبون</span>
                                        <span className="text-xl font-black text-[#0C612D] drop-shadow-sm">{order.total.toFixed(2)} ريال</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-50">
                                    <p className="w-full text-xs text-gray-400 mb-2">تحديث حالة الطلب (سيتم إرسال إشعار للزبون تلقائياً):</p>
                                    {Object.values(OrderStatus).map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleOrderStatusUpdate(order, status)}
                                            disabled={order.status === status}
                                            className={`px-4 py-2 rounded-lg text-sm transition-all border font-medium
                                                ${order.status === status ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50' : 'bg-white hover:bg-[#F68B1F] hover:text-white hover:border-[#F68B1F] text-gray-700 border-gray-200 shadow-sm'}`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                 </div>
            </div>
        )}

        {activeTab === 'admins' && currentUser.email === 'malakpubglite056@gmail.com' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">صلاحيات المسؤولين</h2>
                    <Button onClick={() => setIsRegisteringAdmin(true)}>
                        <Users className="w-5 h-5" /> إضافة مسؤول جديد
                    </Button>
                </div>
                
                {isRegisteringAdmin && (
                     <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-[#F68B1F]">
                        <h3 className="font-bold mb-4">بيانات المسؤول الجديد</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input type="text" placeholder="الاسم" className="border p-2 rounded" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} />
                            <input type="email" placeholder="البريد الإلكتروني" className="border p-2 rounded ltr text-left" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} />
                            <input type="password" placeholder="كلمة المرور" className="border p-2 rounded ltr text-left" value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} />
                            <select className="border p-2 rounded" value={newAdmin.status} onChange={e => setNewAdmin({...newAdmin, status: e.target.value as AdminStatus})}>
                                <option value={AdminStatus.PENDING}>معلق (Pending)</option>
                                <option value={AdminStatus.ACCEPTED}>مقبول (Accepted)</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={handleSaveAdmin}>حفظ</Button>
                            <Button variant="outline" onClick={() => setIsRegisteringAdmin(false)}>إلغاء</Button>
                        </div>
                     </div>
                )}

                <div className="grid gap-4">
                    {allAdmins.filter(a => a.email !== 'malakpubglite056@gmail.com').map(admin => (
                        <div key={admin.id} className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <div className="font-bold text-lg">{admin.name}</div>
                                <div className="text-gray-500 text-sm ltr text-right">{admin.email}</div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    admin.status === AdminStatus.ACCEPTED ? 'bg-green-100 text-green-700' : 
                                    admin.status === AdminStatus.REJECTED ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {admin.status}
                                </span>
                                {admin.status === AdminStatus.PENDING && (
                                    <>
                                        <button onClick={() => onUpdateAdminStatus(admin.id, AdminStatus.ACCEPTED)} className="text-green-600 hover:bg-green-50 p-2 rounded"><CheckCircle /></button>
                                        <button onClick={() => onUpdateAdminStatus(admin.id, AdminStatus.REJECTED)} className="text-red-600 hover:bg-red-50 p-2 rounded"><XCircle /></button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                    {allAdmins.filter(a => a.email !== 'malakpubglite056@gmail.com').length === 0 && (
                        <p className="text-gray-500 text-center py-8">لا يوجد مسؤولين إضافيين حالياً</p>
                    )}
                </div>
            </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
             <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">إدارة العروض والخصومات</h2>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-200 text-orange-800 flex gap-2">
                    <Bell className="w-5 h-5 flex-shrink-0" />
                    <span>أي تعديل على نسبة الخصم سيقوم بإرسال إشعار تلقائي للزبائن.</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {allProducts.filter(p => p.discount && p.discount > 0).length === 0 ? (
                        <div className="col-span-full text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-200">
                             <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Tag className="w-8 h-8 text-gray-400" />
                             </div>
                             <p className="text-gray-500 font-medium">لا توجد عروض نشطة حالياً.</p>
                             <p className="text-sm text-gray-400 mb-4">يمكنك إضافة خصومات على المنتجات من قائمة المنتجات.</p>
                             <Button variant="outline" onClick={() => setActiveTab('products')} className="mx-auto">
                                الذهاب للمنتجات
                             </Button>
                        </div>
                    ) : (
                        allProducts.filter(p => p.discount && p.discount > 0).map(p => (
                            <div key={p.id} className="bg-white p-4 rounded-xl border border-orange-200 relative group">
                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow-sm z-10">-{p.discount}%</div>
                                <div className="relative overflow-hidden rounded mb-2 bg-gray-100 h-32">
                                    <img src={p.imageUrl} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
                                </div>
                                <h3 className="font-bold text-gray-800 truncate">{p.name}</h3>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-[#0C612D] font-bold">{(p.price * (1 - (p.discount! / 100))).toFixed(2)} ريال</span>
                                    <span className="text-gray-400 line-through text-xs">{p.price}</span>
                                </div>
                                <button onClick={() => { setEditProduct(p); setIsEditingProduct(true); }} className="mt-3 w-full py-1 border border-[#F68B1F] text-[#F68B1F] rounded text-sm hover:bg-[#F68B1F] hover:text-white transition flex items-center justify-center gap-1">
                                    <Edit className="w-3 h-3" /> تعديل العرض
                                </button>
                            </div>
                        ))
                    )}
                </div>
             </div>
        )}

        {activeTab === 'notifications' && (
             <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">الإشعارات</h2>
                    <Button onClick={() => setIsSendingNotification(true)}>
                        <Plus className="w-5 h-5" /> إرسال إشعار جديد
                    </Button>
                </div>

                {isSendingNotification && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                                <Send className="w-5 h-5 text-[#F68B1F]" />
                                إرسال إشعار للزبائن
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">سيتم إرسال هذا الإشعار إلى جميع مستخدمي التطبيق.</p>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 h-32 mb-4 outline-none focus:border-[#F68B1F] focus:ring-1 focus:ring-[#F68B1F]"
                                placeholder="اكتب نص الإشعار هنا..."
                                value={notificationMessage}
                                onChange={(e) => setNotificationMessage(e.target.value)}
                            />
                            <div className="flex gap-3">
                                <Button onClick={handleSendNotif} className="flex-1">إرسال الآن</Button>
                                <Button variant="outline" onClick={() => setIsSendingNotification(false)} className="flex-1">إلغاء</Button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {notifications.length === 0 ? (
                         <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                            <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Bell className="w-8 h-8 text-[#F68B1F]" />
                            </div>
                            <p className="text-gray-500 text-lg">لا توجد إشعارات سابقة</p>
                            <p className="text-sm text-gray-400 mt-2">يتم إرسال الإشعارات تلقائياً عند إضافة عروض جديدة.</p>
                        </div>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col gap-2">
                                <div className="flex justify-between items-start">
                                    <p className="font-bold text-gray-800 text-lg">{notif.message}</p>
                                    <span className="text-xs text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">
                                        {new Date(notif.date).toLocaleDateString('ar-EG')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1 border-t pt-2 border-gray-50">
                                     <CheckCircle className="w-3 h-3 text-green-500" /> 
                                     <span className="text-green-600 font-medium">تم الإرسال</span>
                                     <span className="text-gray-300">|</span>
                                     <span>{new Date(notif.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
             </div>
        )}

      </div>
      
      {isEditingProduct && renderProductForm()}
    </div>
  );
};