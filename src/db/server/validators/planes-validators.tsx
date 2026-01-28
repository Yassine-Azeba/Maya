import z from "zod";

export const PlaneIcons = [
    "Binary","Mail","Link2","Smartphone","Minus","Calendar","Clock","Star","Heart","Shield",
    "Lock","Cloud","CloudCog","CloudUpload","CloudDownload","Wifi","Network","Rocket","Brackets",
    "Lightbulb","Sparkles","Flame","TrendingUp","Compass","Map","Settings","Sliders","Sigma",
    "Wrench","Drill","ToolCase","Gauge","Cpu","Database","HardDrive","Folder","Folders",
    "Archive","Inbox","Layers","LayoutGrid","Boxes","Package","Briefcase","Book","Notebook",
    "StickyNote","FileText","Clipboard","CheckSquare","ListTodo","Target","TextInitial"
]

export const createPlaneSchema = z.object({
    name: z.string().min(2, {error:"2 characters minimum."}).max(255, {error:"255 characters maximum."}),
    description : z.string().max(2000, {error:"2000 characters maximum."}).optional(),
    icon : z.enum(PlaneIcons)
})

export const updatePlaneSchema = z.object({
    name: z.string().max(255, {error:"255 characters maximum."}).optional(),
    description : z.string().max(2000, {error:"2000 characters maximum."}).optional(),
    icon : z.enum(PlaneIcons).optional()
})