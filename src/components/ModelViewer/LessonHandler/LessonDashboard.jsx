// src/components/LessonHandler/LessonDashboard.jsx
import React, { useState } from 'react';

// Icons for the accordion open/close state
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 transition-transform duration-300">
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);

// This is your new data structure. Each category object contains a title and its own list of lessons.
// I've added placeholder lessons; you can replace these with your actual lesson names.
const anatomyCategories = [
  { 
    title: "Vertebral column", 
    lessons: ["Overview of Vertebrae", "Vertebral Foramen", "Spinous Processes"] 
  },
  { 
    title: "Spinal curvatures", 
    lessons: ["Primary Curvatures (Kyphosis)", "Secondary Curvatures (Lordosis)", "Scoliosis"] 
  },
  { 
    title: "Atlanto-occipital joints", 
    lessons: ["Articular Surfaces", "Ligaments", "Movements (Nodding)"] 
  },
  { 
    title: "Dens", 
    lessons: ["Structure of the Dens", "Articulation with Atlas", "Transverse Ligament"] 
  },
  { 
    title: "Atlas & axis", 
    lessons: ["Anatomy of C1 (Atlas)", "Anatomy of C2 (Axis)", "Atlanto-axial Joint"] 
  },
  { 
    title: "Cervical vertebrae", 
    lessons: ["Typical Cervical (C3-C6)", "Atypical Cervical (C1, C2, C7)", "Foramina Transversaria"] 
  },
  { 
    title: "Thoracic vertebrae", 
    lessons: ["Costal Facets", "Spinous Process Shape", "Articulation with Ribs"] 
  },
  { 
    title: "Lumbar & lumbosacral vertebrae", 
    lessons: ["Large Vertebral Body", "Lumbar Spine Biomechanics", "Lumbosacral Angle"] 
  },
  { 
    title: "L5-s1 lumbosacral junction", 
    lessons: ["Anatomy of L5", "Anatomy of S1", "Intervertebral Disc and Ligaments"] 
  },
  { 
    title: "Zygapophyseal joints", 
    lessons: ["Also known as Facet Joints", "Joint Capsule", "Clinical Significance"] 
  },
  { 
    title: "Lumbosacral joints & sacral joints", 
    lessons: ["Lumbosacral Articulation", "Sacrococcygeal Joint", "Median Sacral Crest"] 
  },
  { 
    title: "Sacroiliac joints", 
    lessons: ["Articulation with Pelvis", "Supporting Ligaments", "SI Joint Dysfunction"] 
  },
  { 
    title: "Pubic symphysis", 
    lessons: ["Cartilaginous Joint", "Role in Pelvic Girdle", "Changes During Pregnancy"] 
  },
  { 
    title: "Sacrum", 
    lessons: ["Fused Vertebrae (S1-S5)", "Sacral Foramina", "Sacral Canal"] 
  },
  { 
    title: "Coccyx", 
    lessons: ["Tailbone Anatomy", "Vestigial Structure", "Coccygeal Ligaments"] 
  },
  { 
    title: "Lumbar intervertebral disks", 
    lessons: ["Annulus Fibrosus", "Nucleus Pulposus", "Disc Herniation"] 
  },
];

function LessonDashboard() {
  // ✅ State to track which accordion item is currently open. '-1' means all are closed.
  const [openIndex, setOpenIndex] = useState(-1);

  // ✅ Function to handle clicking a category header
  const handleToggle = (index) => {
    // If the clicked item is already open, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <div className="flex flex-col h-40 md:h-100">
      <h2 className="text-md md:text-xl font-bold mb-4 px-1">Anatomy Lessons</h2>
      <div className="flex flex-col space-y-2">
        {anatomyCategories.map((category, index) => (
          <div key={index} className="border-b border-gray-200 last:border-b-0">
            {/* Category Header Button */}
            <button
              onClick={() => handleToggle(index)}
              className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm md:font-semibold text-gray-800">{category.title}</span>
              <span className={openIndex === index ? 'rotate-180' : ''}>
                <ChevronDownIcon />
              </span>
            </button>

            {/* Collapsible Lesson List */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <ul className="py-2 pl-6 pr-3">
                {category.lessons.map((lesson, lessonIndex) => (
                <li
                  key={lessonIndex}
                  className="text-gray-700 text-sm md:text-xs p-2 rounded-md hover:bg-blue-50 cursor-pointer"
                >
                  {lesson}
                </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LessonDashboard;