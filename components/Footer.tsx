import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-black px-16 py-4 text-white">
      <div className="container mx-auto flex flex-col justify-between py-4 md:flex-row">
        {/* Kontak Section */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-md mb-2 font-bold">Kontak</h3>
          <p className="text-sm">
            Kampus 1: Jalan Perintis Kemerdekaan Km.10, Makassar;
          </p>
          <p className="text-sm">Kampus 2: Jln. Poros Malino Km.6, Gowa</p>
          <p className="text-sm">Email: informatika@unhas.ac.id</p>
        </div>

        {/* Link Section */}
        <div>
          <h3 className="text-md mb-2 font-bold">Link</h3>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="https://unhas.ac.id" className="hover:underline">
                https://unhas.ac.id
              </a>
            </li>
            <li>
              <a href="https://sso.unhas.ac.id" className="hover:underline">
                https://sso.unhas.ac.id
              </a>
            </li>
            <li>
              <a href="https://digilib.unhas.ac.id" className="hover:underline">
                https://digilib.unhas.ac.id
              </a>
            </li>
            <li>
              <a
                href="https://repository.unhas.ac.id"
                className="hover:underline"
              >
                https://repository.unhas.ac.id
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="px-16 pb-1 pt-4 text-center text-[12px] text-white">
        © 2024 Sisfor11. All Rights Reserved
      </div>
    </footer>
  );
}
