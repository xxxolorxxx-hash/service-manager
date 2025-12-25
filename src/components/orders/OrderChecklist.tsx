import { useState } from 'react';
import { ChecklistItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface OrderChecklistProps {
    tasks: ChecklistItem[];
    onUpdate: (tasks: ChecklistItem[]) => void;
}

export function OrderChecklist({ tasks = [], onUpdate }: OrderChecklistProps) {
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask: ChecklistItem = {
            id: crypto.randomUUID(),
            title: newTaskTitle.trim(),
            isCompleted: false,
        };
        onUpdate([...tasks, newTask]);
        setNewTaskTitle('');
    };

    const toggleTask = (id: string) => {
        onUpdate(
            tasks.map((task) =>
                task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
            )
        );
    };

    const removeTask = (id: string) => {
        onUpdate(tasks.filter((task) => task.id !== id));
    };

    const completedCount = tasks.filter((t) => t.isCompleted).length;
    const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

    return (
        <Card className="border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                        Lista zadań
                    </CardTitle>
                    <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-full">
                        {completedCount}/{tasks.length} ukończone
                    </span>
                </div>
                <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Postęp prac</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-1.5" />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        placeholder="Dodaj nowe zadanie..."
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        className="bg-white/5 border-white/10"
                    />
                    <Button size="icon" onClick={addTask} disabled={!newTaskTitle.trim()}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {tasks.length === 0 ? (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 text-muted-foreground text-sm italic"
                            >
                                Brak zadań. Dodaj pierwsze zadanie powyżej.
                            </motion.p>
                        ) : (
                            tasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className={cn(
                                        "group flex items-center justify-between p-3 rounded-xl border border-white/5 transition-all",
                                        task.isCompleted ? "bg-white/5 opacity-60" : "bg-white/[0.02] hover:bg-white/5"
                                    )}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Checkbox
                                            checked={task.isCompleted}
                                            onCheckedChange={() => toggleTask(task.id)}
                                            className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                        />
                                        <span
                                            className={cn(
                                                "text-sm font-medium truncate transition-all cursor-pointer",
                                                task.isCompleted && "line-through text-muted-foreground"
                                            )}
                                            onClick={() => toggleTask(task.id)}
                                        >
                                            {task.title}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeTask(task.id)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
        </Card>
    );
}
