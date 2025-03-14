"use client";

import Slider from "react-slick";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useRef } from "react";

const partners = [
  { id: 1, src: "/assets/partner_sayafrica.png", alt: "Say Africa" },
  { id: 2, src: "/assets/partner_lifr.png", alt: "Islamic Finance Review" },
  { id: 3, src: "/assets/partner_ifc.png", alt: "Islamic Finance Connect" },
];

export default function PartnersSlider() {
  const sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="pt-10 bg-white pb-36">
      <h2 className="text-center text-2xl font-semibold text-gray-700">
        Our Partners
      </h2>
      <div className="w-20 border-t-2 border-brandGold mx-auto my-5"></div>

      <div className="relative w-5/6 mx-auto h-full py-36">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-brandGold p-2 text-2xl z-10"
          onClick={() => sliderRef.current.slickPrev()}
        >
          <FaChevronLeft />
        </button>

        {/* Slider */}
        <Slider ref={sliderRef} {...settings} className="px-8 w-full">
          {partners.map((partner) => (
            <div
              key={partner.id}
              style={{ display: "flex !important" }}
              className="!flex justify-center items-center"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={200}
                height={100}
                className="object-contain"
              />
            </div>
          ))}
        </Slider>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-brandGold p-2 text-2xl z-10"
          onClick={() => sliderRef.current.slickNext()}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
