"use client";

import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

// Categories
const categories = [
    "All",
    "Travel Guide",
    "Tips & Tricks",
    "Food & Dining",
    "Sustainability",
    "Events",
    "Business",
];

// Data mẫu
const blogList = [
    {
        id: 1,
        title: "Essential Travel Tips for First-Time Hotel Guests",
        category: "Tips & Tricks",
        image: "/images/htel2.jpg",
        date: "2024-11-01",
        read: "4 min read",
        content:
        "Here are the most essential travel tips for first-time hotel guests... (full content).",
    },
    {
        id: 2,
        title: "Exploring Local Cuisine: A Foodie’s Guide",
        category: "Food & Dining",
        image: "/images/htel3.jpg",
        date: "2024-10-28",
        read: "6 min read",
        content:
        "Discover the rich culinary culture and explore the best food experiences... (full content).",
    },
    {
        id: 3,
        title: "Sustainable Tourism: How We’re Going Green",
        category: "Sustainability",
        image: "/images/htel4.jpg",
        date: "2024-10-25",
        read: "5 min read",
        content:
        "Our commitment to sustainable tourism includes eco-friendly practices... (full content).",
    },
    ];

    const featuredBlog = {
    id: 99,
    title: "Top 10 Luxury Hotels in Vietnam for 2024",
    category: "Travel Guide",
    image: "/images/Hotel1.jpg",
    date: "2024-11-05",
    read: "5 min read",
    author: "Admin",
    content:
        "Discover the most exclusive and luxurious hotel experiences across Vietnam... (full content).",
    };

    const BlogPage = () => {
    const [active, setActive] = useState("All");
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [panelOpen, setPanelOpen] = useState(false);

    const openPanel = (blog) => {
        setSelectedBlog(blog);
        setPanelOpen(true);
    };

    const closePanel = () => {
        setPanelOpen(false);
        setTimeout(() => setSelectedBlog(null), 250);
    };

    return (
        <div className="w-full max-w-7xl mx-auto py-10 px-4 relative">

        {/* TITLE */}
        <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold">Travel Blog & News</h1>
            <p className="text-gray-500 mt-1">
            Discover travel tips, hotel guides, and insider stories from our experts
            </p>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-2xl mx-auto mb-10">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
            type="text"
            placeholder="Search articles..."
            className="w-full border rounded-full pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-400"
            />
        </div>

        {/* FILTER TAGS */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
            {categories.map((c) => (
            <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-1.5 rounded-full text-sm border ${
                active === c
                    ? "bg-black text-white border-black"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
            >
                {c}
            </button>
            ))}
        </div>

        {/* FEATURED BLOG */}
        <div
            onClick={() => openPanel(featuredBlog)}
            className="cursor-pointer grid md:grid-cols-2 bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden mb-12"
        >
            <img src={featuredBlog.image} className="w-full h-80 object-cover" />
            <div className="p-6">
            <span className="text-xs font-semibold bg-black text-white px-3 py-1 rounded-full">
                {featuredBlog.category}
            </span>

            <h2 className="text-2xl font-bold mt-4">{featuredBlog.title}</h2>

            <p className="text-gray-600 mt-3">{featuredBlog.content.substring(0, 90)}...</p>

            <div className="flex items-center gap-4 text-gray-500 text-sm mt-4">
                <span>👤 {featuredBlog.author}</span>
                <span>📅 {featuredBlog.date}</span>
                <span>⏱️ {featuredBlog.read}</span>
            </div>

            <button className="mt-5 px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800">
                Read More →
            </button>
            </div>
        </div>

        {/* BLOG GRID */}
        <div className="grid md:grid-cols-3 gap-6">
            {blogList.map((blog) => (
            <div
                key={blog.id}
                onClick={() => openPanel(blog)}
                className="cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden hover:-translate-y-1 transition"
            >
                <img src={blog.image} className="w-full h-48 object-cover" />

                <div className="p-5">
                <span className="text-xs font-semibold bg-blue-600 text-white px-3 py-1 rounded-full">
                    {blog.category}
                </span>

                <h3 className="font-semibold text-lg mt-3">{blog.title}</h3>

                <div className="flex text-xs text-gray-500 justify-between mt-3">
                    <span>📅 {blog.date}</span>
                    <span>⏱️ {blog.read}</span>
                </div>
                </div>
            </div>
            ))}
        </div>

        {/* ===================== SLIDING PANEL ===================== */}
        <div
            className={`
            fixed top-0 right-0 h-full w-full md:w-[60%] lg:w-[45%]
            bg-white shadow-xl z-50 transform transition-transform duration-300
            ${panelOpen ? "translate-x-0" : "translate-x-full"}
            `}
        >
            {selectedBlog && (
            <div className="p-6 overflow-y-auto h-full">

                {/* CLOSE BUTTON */}
                <button
                onClick={closePanel}
                className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-black"
                >
                <IoClose />
                </button>

                <img src={selectedBlog.image} className="w-full h-64 object-cover rounded-lg" />

                <h2 className="text-3xl font-bold mt-5">{selectedBlog.title}</h2>

                <p className="text-gray-500 mt-3 flex gap-4 text-sm">
                <span>📅 {selectedBlog.date}</span>
                <span>⏱️ {selectedBlog.read}</span>
                </p>

                <p className="mt-6 text-gray-700 leading-relaxed text-lg">
                {selectedBlog.content}
                </p>
            </div>
            )}
        </div>

        {/* BACKDROP */}
        {panelOpen && (
            <div
            onClick={closePanel}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
        )}
        </div>
    );
};

export default BlogPage;
