"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Tags, Pencil, Trash2, AlertCircle } from "lucide-react";
import { useStore, Category } from "@/store/useStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

const PRESET_COLORS = [
  "#0F9D8F", // Teal
  "#2563EB", // Blue
  "#7C3AED", // Violet
  "#E11D48", // Rose
  "#D97706", // Amber
  "#16A34A", // Green
  "#475569", // Slate
];

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, medicines } = useStore();
  
  // Add/Edit Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [nameError, setNameError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setDescription("");
    setColor(PRESET_COLORS[0]);
    setNameError("");
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setDescription(cat.description || "");
    setColor(cat.color || PRESET_COLORS[0]);
    setNameError("");
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Category name is required");
      return;
    }

    const isDuplicate = categories.some(
      c => c.name.toLowerCase() === trimmedName.toLowerCase() && c.id !== editingId
    );

    if (isDuplicate) {
      setNameError("This category already exists");
      return;
    }

    setNameError("");
    setIsSaving(true);

    // Simulate network delay for the spinner effect
    await new Promise(resolve => setTimeout(resolve, 500));

    if (editingId) {
      updateCategory(editingId, { name: trimmedName, description, color });
      toast.success("Category updated");
    } else {
      addCategory({
        id: Math.random().toString(36).substr(2, 9),
        name: trimmedName,
        count: 0,
        description,
        color
      });
      toast.success("Category added");
    }

    setIsSaving(false);
    setIsDialogOpen(false);
  };

  const handleOpenDelete = (cat: Category) => {
    setCategoryToDelete(cat);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete.id);
      toast.success("Category deleted");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  // Compute linked medicines for each category dynamically
  const getLinkedMedicinesCount = (catName: string) => {
    return medicines.filter(m => m.category === catName).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Categories
        </h1>
        
        <Button onClick={handleOpenAdd} className="gap-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-0 border-b border-slate-200">
              <TableHead className="w-[400px] text-slate-600 font-medium">Category Name</TableHead>
              <TableHead className="text-slate-600 font-medium">Number of Medicines</TableHead>
              <TableHead className="text-right text-slate-600 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} className="border-0 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium flex items-center gap-3 text-slate-900">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${cat.color || PRESET_COLORS[0]}15` }}
                  >
                    <Tags className="h-5 w-5" style={{ color: cat.color || PRESET_COLORS[0] }} />
                  </div>
                  <div>
                    <p>{cat.name}</p>
                    {cat.description && <p className="text-xs text-slate-500 font-normal">{cat.description}</p>}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-slate-900">{getLinkedMedicinesCount(cat.name)}</span> <span className="text-slate-500">medicines</span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(cat)} className="h-8 w-8 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenDelete(cat)} className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-slate-500 py-16 text-lg">
                  No categories yet. Add your first category to organize medicines.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">
              {editingId ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-5 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-700 font-medium">Category Name <span className="text-red-500">*</span></Label>
              <Input 
                id="name" 
                value={name} 
                onChange={e => { setName(e.target.value); setNameError(""); }} 
                placeholder="e.g. Pain Relief"
                className={`bg-slate-50 border-slate-200 text-slate-900 rounded-xl ${nameError ? 'border-red-500 focus-visible:ring-red-500' : 'focus-visible:ring-teal-500'}`} 
              />
              {nameError && <p className="text-sm text-red-500 animate-in slide-in-from-top-1">{nameError}</p>}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-slate-700 font-medium">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} 
                placeholder="e.g. Pain relief, fever, cold & flu medicines"
                className="bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus-visible:ring-teal-500 resize-none h-24" 
              />
            </div>

            <div className="grid gap-3">
              <Label className="text-slate-700 font-medium">Color Tag</Label>
              <div className="flex items-center gap-3">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${color === c ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-110'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl">Cancel</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl min-w-[100px]">
              {isSaving ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Delete Category?
            </DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p className="text-slate-600">
              Are you sure you want to delete <span className="font-semibold text-slate-900">"{categoryToDelete?.name}"</span>?
            </p>
            {categoryToDelete && getLinkedMedicinesCount(categoryToDelete.name) > 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <p className="font-semibold flex items-center gap-1 mb-1">
                  <AlertCircle className="h-4 w-4" />
                  {getLinkedMedicinesCount(categoryToDelete.name)} medicines use this category
                </p>
                <p>They won't be deleted, but you'll need to reassign their category later.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl">Cancel</Button>
            <Button onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
