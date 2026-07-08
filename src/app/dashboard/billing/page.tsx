"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Minus, Trash2, ShoppingCart, Package } from "lucide-react";
import { useStore, Medicine } from "@/store/useStore";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface CartItem {
  medicineId: string;
  name: string;
  qty: number;
  price: number;
  mrp: number;
  maxQty: number;
}

const getCategoryStyles = (category: string) => {
  switch (category) {
    case "Medicines":
      return {
        bg: "bg-sky-50/30 hover:bg-sky-50/70 border-sky-100/80 hover:border-sky-300",
        iconContainer: "bg-sky-100 text-sky-600 border-sky-200",
        badge: "bg-sky-100/85 text-sky-800 hover:bg-sky-200 border-none font-bold",
      };
    case "Cosmetics":
      return {
        bg: "bg-pink-50/30 hover:bg-pink-50/70 border-pink-100/80 hover:border-pink-300",
        iconContainer: "bg-pink-100 text-pink-600 border-pink-200",
        badge: "bg-pink-100/85 text-pink-800 hover:bg-pink-200 border-none font-bold",
      };
    case "Personal Care":
      return {
        bg: "bg-emerald-50/30 hover:bg-emerald-50/70 border-emerald-100/80 hover:border-emerald-300",
        iconContainer: "bg-emerald-100 text-emerald-600 border-emerald-200",
        badge: "bg-emerald-100/85 text-emerald-800 hover:bg-emerald-200 border-none font-bold",
      };
    case "Supplements":
      return {
        bg: "bg-amber-50/30 hover:bg-amber-50/70 border-amber-100/80 hover:border-amber-300",
        iconContainer: "bg-amber-100 text-amber-600 border-amber-200",
        badge: "bg-amber-100/85 text-amber-800 hover:bg-amber-200 border-none font-bold",
      };
    case "Baby Care":
      return {
        bg: "bg-purple-50/30 hover:bg-purple-50/70 border-purple-100/80 hover:border-purple-300",
        iconContainer: "bg-purple-100 text-purple-600 border-purple-200",
        badge: "bg-purple-100/85 text-purple-800 hover:bg-purple-200 border-none font-bold",
      };
    case "First Aid":
      return {
        bg: "bg-rose-50/30 hover:bg-rose-50/70 border-rose-100/80 hover:border-rose-300",
        iconContainer: "bg-rose-100 text-rose-600 border-rose-200",
        badge: "bg-rose-100/85 text-rose-800 hover:bg-rose-200 border-none font-bold",
      };
    default:
      return {
        bg: "bg-slate-50/30 hover:bg-slate-50/70 border-slate-100/80 hover:border-slate-300",
        iconContainer: "bg-slate-100 text-slate-600 border-slate-200",
        badge: "bg-slate-100/85 text-slate-800 hover:bg-slate-200 border-none font-bold",
      };
  }
};

export default function BillingPage() {
  const { medicines, completeSale } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Filter medicines based on search query
  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    med.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (med: Medicine) => {
    if (med.qty <= 0) {
      toast.error("Item is out of stock!");
      return;
    }

    const existing = cartItems.find(item => item.medicineId === med.id);
    if (existing) {
      if (existing.qty < med.qty) {
        setCartItems(cartItems.map(item => 
          item.medicineId === med.id ? { ...item, qty: item.qty + 1 } : item
        ));
        toast.success(`Added another ${med.name} to cart`);
      } else {
        toast.error(`Cannot exceed available stock (${med.qty} units)`);
      }
    } else {
      setCartItems([...cartItems, { 
        medicineId: med.id, 
        name: med.name, 
        qty: 1, 
        price: med.price, 
        mrp: med.mrp, 
        maxQty: med.qty 
      }]);
      toast.success(`${med.name} added to cart`);
    }
  };

  const handleUpdateQty = (id: string, newQty: number) => {
    setCartItems(cartItems.map(item => {
      if (item.medicineId === id) {
        if (newQty > item.maxQty) {
          toast.error(`Cannot exceed available stock (${item.maxQty} units)`);
          return { ...item, qty: item.maxQty };
        }
        if (newQty < 1) return { ...item, qty: 1 };
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter(item => item.medicineId !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const total = subtotal;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    completeSale({
      id: Math.random().toString(36).substr(2, 9),
      items: cartItems.map(item => ({
        medicineId: item.medicineId,
        name: item.name,
        qty: item.qty,
        price: item.price,
        total: item.price * item.qty
      })),
      mrpTotal: cartItems.reduce((acc, item) => acc + (item.mrp * item.qty), 0),
      discount: cartItems.reduce((acc, item) => acc + ((item.mrp - item.price) * item.qty), 0),
      payable: total,
      date: new Date().toISOString()
    });

    setCartItems([]);
    setCustomerName("");
    setPaymentMethod("Cash");
    toast.success("Checkout completed successfully!");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales / Point of Sale</h1>
          <p className="text-slate-500 mt-1">Manage your medical store inventory</p>
        </div>
        <Button className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg shadow-sm shadow-teal-500/20 font-medium">
          <Plus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Search & Product Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input 
              placeholder="Search products to add to cart..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-6 bg-white border-slate-200 rounded-xl text-base shadow-sm focus-visible:ring-teal-500 text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredMedicines.map((med) => {
              const styles = getCategoryStyles(med.category);
              return (
                <div 
                  key={med.id}
                  onClick={() => addToCart(med)}
                  className={`border rounded-2xl p-4 flex flex-col justify-between hover:shadow-md cursor-pointer transition-all duration-200 ${styles.bg} ${
                    med.qty === 0 ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className={`h-12 w-12 rounded-xl border flex items-center justify-center ${styles.iconContainer}`}>
                        <Package className="h-6 w-6" />
                      </div>
                      <Badge className={`text-[10px] ${styles.badge}`}>
                        {med.category}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">{med.name}</h3>
                      <p className="text-xs text-slate-400 mt-0.5">{med.supplier}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 border-t border-slate-100 pt-3">
                    <span className="text-teal-600 font-extrabold text-base">₹{med.price}</span>
                    <span className="text-[11px] font-medium text-slate-500 bg-white/70 border border-slate-100 px-2 py-0.5 rounded-full">
                      Stock: {med.qty}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Cart Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm h-fit flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-4 border-b border-slate-100">
              <ShoppingCart className="h-5 w-5 text-teal-500" />
              <span>Cart ({cartItems.reduce((acc, i) => acc + i.qty, 0)})</span>
            </div>

            {/* Cart Items List */}
            {cartItems.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 text-sm">
                <ShoppingCart className="h-12 w-12 stroke-[1.5] text-slate-300 mb-2 animate-bounce" />
                <p>Cart is empty</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto pr-1 mt-2">
                {cartItems.map((item) => (
                  <div key={item.medicineId} className="py-3 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{item.name}</p>
                      <p className="text-xs text-teal-600 font-semibold mt-0.5">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 bg-slate-50 border rounded-lg p-0.5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-500 hover:text-slate-900 rounded-md" 
                        onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.medicineId, item.qty - 1); }}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-slate-500 hover:text-slate-900 rounded-md" 
                        onClick={(e) => { e.stopPropagation(); handleUpdateQty(item.medicineId, item.qty + 1); }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => { e.stopPropagation(); removeFromCart(item.medicineId); }} 
                      className="h-7 w-7 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Checkout Controls */}
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Customer name (optional)</label>
              <Input 
                placeholder="Enter customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-slate-50 border-slate-200 text-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">Payment Mode</label>
              <select 
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm p-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
            </div>

            <div className="space-y-2.5 pt-2 text-sm">
              <div className="flex justify-between items-center text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center text-slate-900 font-extrabold text-base pt-1.5 border-t border-slate-100">
                <span>Total</span>
                <span className="text-teal-600 font-black text-lg">₹{total}</span>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full h-11 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold rounded-xl shadow-md shadow-teal-500/20 disabled:opacity-50 transition-all duration-200"
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
