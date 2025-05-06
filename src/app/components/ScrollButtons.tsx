import { useState, useEffect, useRef } from "react";

interface ScrollButtonsProps {
  categories: string[];
}

export default function ScrollButtons({ categories }: ScrollButtonsProps) {
  const [activeCategory, setActiveCategory] = useState<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  // Handle scroll to specific category
  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Update active category on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Get viewport height
      const viewportHeight = window.innerHeight;
      // Adjust this threshold based on your layout - this means an element
      // needs to occupy this percentage of the viewport to be considered "active"
      const thresholdPercent = 0.2;

      // Check each category to determine which one is most visible
      let maxVisibleHeight = -1;
      let mostVisibleCategory = "";

      for (const category of categories) {
        const element = document.getElementById(`category-${category}`);
        if (element) {
          const rect = element.getBoundingClientRect();

          // If element is at least partially in viewport
          if (rect.top < viewportHeight && rect.bottom > 0) {
            // Calculate how much of the element is visible
            const visibleTop = Math.max(0, rect.top);
            const visibleBottom = Math.min(viewportHeight, rect.bottom);
            const visibleHeight = visibleBottom - visibleTop;

            // If this element has more visible area than our current max
            if (
              visibleHeight > maxVisibleHeight &&
              visibleHeight > viewportHeight * thresholdPercent
            ) {
              maxVisibleHeight = visibleHeight;
              mostVisibleCategory = category;
            }
          }
        }
      }

      // Only update if we found a visible category
      if (mostVisibleCategory && mostVisibleCategory !== activeCategory) {
        setActiveCategory(mostVisibleCategory);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [categories, activeCategory]);

  // Scroll the active button into view when it changes
  useEffect(() => {
    if (
      activeCategory &&
      scrollContainerRef.current &&
      buttonRefs.current[activeCategory]
    ) {
      const container = scrollContainerRef.current;
      const button = buttonRefs.current[activeCategory];

      if (button) {
        // Calculate positions
        const containerLeft = container.scrollLeft;
        const containerRight = containerLeft + container.offsetWidth;
        const buttonLeft = button.offsetLeft;
        const buttonRight = buttonLeft + button.offsetWidth;

        // Check if button is not fully visible
        if (buttonLeft < containerLeft) {
          // Button is off to the left
          container.scrollTo({
            left: buttonLeft - 16, // Add some padding
            behavior: "smooth",
          });
        } else if (buttonRight > containerRight) {
          // Button is off to the right
          container.scrollTo({
            left: buttonRight - container.offsetWidth + 16, // Add some padding
            behavior: "smooth",
          });
        }
      }
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-16 z-10 bg-white py-2 shadow-md rounded-lg">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto gap-2 px-4 max-w-7xl mx-auto no-scrollbar">
        {categories.map((category) => (
          <button
            key={category}
            ref={(el) => {
              buttonRefs.current[category] = el;
            }}
            onClick={() => scrollToCategory(category)}
            className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-(--buttonSelectedBg) text-white"
                : "bg-(--buttonUnselectedBg) hover:bg-stone-200"
            }`}>
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
