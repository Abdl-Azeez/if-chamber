"use client";

import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // install swiper
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";

export default function Partners() {
  const partners = [
    { id: 1, name: "say", logo: "/partner_sayafrica.png" },
    { id: 2, name: "IFC", logo: "/partner_ifc.png" },
    { id: 3, name: "LIFR", logo: "/partner_lifr.png" },
    // { id: 4, name: "LIFR", logo: "/partner_lifr.png" },
    // { id: 5, name: "LIFR", logo: "/partner_lifr.png" },
  ];

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Partners</h2>
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: false,
          }}
          navigation={true}
          modules={[Autoplay, Navigation]}
          className="mySwiper"
        >
          {partners.map((partner) => (
            <SwiperSlide key={partner.id}>
              <div className="flex items-center justify-center">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={150}
                  height={100}
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
