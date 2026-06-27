import React, { useState, useEffect } from 'react';
import { ActiveTab, Hotel, Booking, Promo, UserProfile, Flight } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import SearchResults from './components/SearchResults';
import PropertyDetail from './components/PropertyDetail';
import Checkout from './components/Checkout';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import WriteReview from './components/WriteReview';
import CheckInOnline from './components/CheckInOnline';
import WalletTopUp from './components/WalletTopUp';
import Promosi from './components/Promosi';
import AdminConsole from './components/AdminConsole';

// Curated Luxury Hotels Data
const INITIAL_HOTELS: Hotel[] = [
    {
        id: 'nusa-dua-beach',
        name: 'Nusa Dua Beach Hotel & Spa',
        rating: 4.9,
        ratingText: 'Luar Biasa',
        stars: 5,
        location: 'Nusa Dua, Bali',
        city: 'Bali',
        pricePerNight: 4500000,
        originalPricePerNight: 6000000,
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAogCOFF5tLCwexkCBMhBaFK5FyAFosphw5Sal8snuKNW8C1CeRL_HfpDP_rmLEhd26rC7hyUyON7PGLSty2JZM6VEIDx2XvspE--mH4eubHjEFNKm9ox26M5SicWsdSfwlq66KUc7mWGU6IAz1bAqgLl9YbzYU3mOw1H0RhWG86-vkXQeT7s0Qu8FfEaLhChuzAWYAvlwdkCXisY8TGNyJiu-BIpTjfzb_EIMN-PMWBiVS0Ug36MILOuGvJMsY8bue9DH_Q5V3UQ0',
        imageUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAogCOFF5tLCwexkCBMhBaFK5FyAFosphw5Sal8snuKNW8C1CeRL_HfpDP_rmLEhd26rC7hyUyON7PGLSty2JZM6VEIDx2XvspE--mH4eubHjEFNKm9ox26M5SicWsdSfwlq66KUc7mWGU6IAz1bAqgLl9YbzYU3mOw1H0RhWG86-vkXQeT7s0Qu8FfEaLhChuzAWYAvlwdkCXisY8TGNyJiu-BIpTjfzb_EIMN-PMWBiVS0Ug36MILOuGvJMsY8bue9DH_Q5V3UQ0',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAK7i1stpq4kuWBiMATHh7hXYCPHW0Yr8H0qFB0zne5YJhSOnZjNEnexS-qkLRHFF3_bIikYSgEKAsgu_vHTuUNrA5mDHdI8RWBGfXVzjZIOmK68Q2U7SoTxJ7DPYxpeEvJjHnOVhYxXJRLaNuYt-OyXVgvuXErSWCHT3nnr1htERSAJrdtlwDb4khRbVCRYgmP86E8PS2owgDqpYe9BSOl6XU3yGen1RJZmJrz_1cXOYSjrFN30EV-ht2c8YaM5TE69bqdTSMtpEU',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFR1nm8mkOhJ0cE0PS2ytysdVRL62uPC5aAa-kosY2WtR1hd7iAh9BUT94R3QWWqbfM54lYjcvQWxZnS_XIf-Yn3ueVW9qvnc8x1mLtJghotCIPfzWoh54Ube2KBo8S-Zys8OIij4PsFnJ4SwHQv-7KJRj37MBmnU0SFiGdq4H7Xab6dN7-DBhbmOENrNNcaESSUkRXcPHzF-7RCSd92oSw-3dVzc2x6BeHiHiwhhyYWmxQQa-WI0vqZpAbLAhAHOM_LYdDe0jQQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCL2D7JE-4_XBXaXOCXaSsBGWobDbc_hgJssQZeBh0OW6TIsWi4OZ7IxmENSQ28m9i-4P8JWBjizPkXyB-WE_yO03zPUHj5gmTmGIK4XGJD4GKd6eCEzx1bDGc0wH6qvJiJOd4kkRwucwwRqLI-zt-6XuLHTOniVfTFMgucG48El2bMm7Uj_c-PX1tXAqSiwvrtCzy12toQG8RD1nXE3_sznAtqCY4d-gU3fOwViGWP-Sf4aiovrAx-BjM7TgxP1v3KNeY81cMWivE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDjXmhYjs9v7_zO27gHXnwdMQ5rfPTuup2UnjQ76DX5J_KJj71arjNA7J0VYeCzdxiIfq5rMqIGcc9eK1UBL4XII_5z6M_OXG0iEYxIApBimTfEnMWGeZrS8r0mo-thHCcp9BPPjxR4NYQd-fl_G_BBc3ZrMhEhcZXZP-NN7koQ-ut2bKtwIL83_X5FiRUVeCfFvdjty1XgZJWgctkE1i0IQO12GtgrTbD2DtdpiuW03NAW7AZP-EDOBXjAqtPzL3X447_BC-iXZos'
        ],
        description: 'Nusa Dua Beach Hotel & Spa berdiri di pesisir pantai berpasir putih Nusa Dua. Resort bintang 5 legendaris ini memadukan arsitektur istana tradisional Bali yang megah dengan kenyamanan modern terlengkap. Nikmati hamparan taman tropis yang rimbun seluas 9 hektar, laguna renang infinity yang menakjubkan, serta spa pemenang penghargaan kelas dunia.',
        amenities: ['Kolam Renang', 'Akses Pantai Langsung', 'Pusat Spa & Kebugaran', 'Restoran Internasional', 'Layanan Kamar 24 Jam', 'Wi-Fi Gratis'],
        scarcityText: 'Tersisa 2 kamar saja!',
        tags: ['Pantai', 'Spa', 'Keluarga']
    },
    {
        id: 'the-langham',
        name: 'The Langham, Jakarta',
        rating: 4.8,
        ratingText: 'Sangat Baik',
        stars: 5,
        location: 'District 8, SCBD, Jakarta',
        city: 'Jakarta',
        pricePerNight: 5200000,
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNZzSopmrblm778queeMTbsrQD8Jf7HUtclhlNWL_4yxXT0t5I3MB0BR0izyj-iinTPZyPnaLgIXyEHD6bt6HF2c2XKl1Epp2w-G11z6uFWn-xTzaR8g3PWhxJWY_lQgZSpHkXanro7ToiXqyV6j07BEQWpaAk52_QLey2Nd4nxw4Hhn7oQygHbA2ylpzd58cpQgCfCcKK4TQhmS6qXKnmc73jZWNnJtHe4cd0DTULnW6SYL_bi_XCRoLGhdf13PCebMvUCRDNvgs',
        imageUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDNZzSopmrblm778queeMTbsrQD8Jf7HUtclhlNWL_4yxXT0t5I3MB0BR0izyj-iinTPZyPnaLgIXyEHD6bt6HF2c2XKl1Epp2w-G11z6uFWn-xTzaR8g3PWhxJWY_lQgZSpHkXanro7ToiXqyV6j07BEQWpaAk52_QLey2Nd4nxw4Hhn7oQygHbA2ylpzd58cpQgCfCcKK4TQhmS6qXKnmc73jZWNnJtHe4cd0DTULnW6SYL_bi_XCRoLGhdf13PCebMvUCRDNvgs',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAK7i1stpq4kuWBiMATHh7hXYCPHW0Yr8H0qFB0zne5YJhSOnZjNEnexS-qkLRHFF3_bIikYSgEKAsgu_vHTuUNrA5mDHdI8RWBGfXVzjZIOmK68Q2U7SoTxJ7DPYxpeEvJjHnOVhYxXJRLaNuYt-OyXVgvuXErSWCHT3nnr1htERSAJrdtlwDb4khRbVCRYgmP86E8PS2owgDqpYe9BSOl6XU3yGen1RJZmJrz_1cXOYSjrFN30EV-ht2c8YaM5TE69bqdTSMtpEU',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFR1nm8mkOhJ0cE0PS2ytysdVRL62uPC5aAa-kosY2WtR1hd7iAh9BUT94R3QWWqbfM54lYjcvQWxZnS_XIf-Yn3ueVW9qvnc8x1mLtJghotCIPfzWoh54Ube2KBo8S-Zys8OIij4PsFnJ4SwHQv-7KJRj37MBmnU0SFiGdq4H7Xab6dN7-DBhbmOENrNNcaESSUkRXcPHzF-7RCSd92oSw-3dVzc2x6BeHiHiwhhyYWmxQQa-WI0vqZpAbLAhAHOM_LYdDe0jQQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCL2D7JE-4_XBXaXOCXaSsBGWobDbc_hgJssQZeBh0OW6TIsWi4OZ7IxmENSQ28m9i-4P8JWBjizPkXyB-WE_yO03zPUHj5gmTmGIK4XGJD4GKd6eCEzx1bDGc0wH6qvJiJOd4kkRwucwwRqLI-zt-6XuLHTOniVfTFMgucG48El2bMm7Uj_c-PX1tXAqSiwvrtCzy12toQG8RD1nXE3_sznAtqCY4d-gU3fOwViGWP-Sf4aiovrAx-BjM7TgxP1v3KNeY81cMWivE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDjXmhYjs9v7_zO27gHXnwdMQ5rfPTuup2UnjQ76DX5J_KJj71arjNA7J0VYeCzdxiIfq5rMqIGcc9eK1UBL4XII_5z6M_OXG0iEYxIApBimTfEnMWGeZrS8r0mo-thHCcp9BPPjxR4NYQd-fl_G_BBc3ZrMhEhcZXZP-NN7koQ-ut2bKtwIL83_X5FiRUVeCfFvdjty1XgZJWgctkE1i0IQO12GtgrTbD2DtdpiuW03NAW7AZP-EDOBXjAqtPzL3X447_BC-iXZos'
        ],
        description: 'Terletak megah di jantung SCBD, The Langham Jakarta adalah definisi kemewahan urban modern. Menawarkan pemandangan menakjubkan cakrawala Jakarta, hotel ini menghadirkan layanan khas Inggris yang anggun dipadukan dengan restoran bintang Michelin, Alice, serta Chuan Spa yang sangat menenangkan pikiran.',
        amenities: ['Sky Pool', 'Restoran Bintang Michelin', 'Layanan Buttler', 'Pusat Kebugaran 24 Jam', 'Wi-Fi Gratis', 'Chuan Spa'],
        tags: ['Bisnis', 'Mewah', 'Kota']
    },
    {
        id: 'amanwana-resort',
        name: 'Amanwana Resort &amp; Wilderness',
        rating: 5.0,
        ratingText: 'Sempurna',
        stars: 5,
        location: 'Pulau Moyo, Nusa Tenggara Barat',
        city: 'Pulau Moyo',
        pricePerNight: 12800000,
        originalPricePerNight: 15000000,
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeoIjK6nXCrqBtXeehnTu_AfbWsDuiMq-XkvQNE_QlGzreiF5sbSNDlwjXos-R3uyqalm3Eo_sgD57lBDU-EWibkkwgcN2YDniZmeG0q73EtP6WSt2rwwWcDKF5lHXPkBVpFUtX7Kxnw3ipJ8mLQr-GFmkceS4UoCNSSP7vxvMCsg6jHR-AjG3wlw94uG_CUHNCH99UE34Ddt6PAXbu3mXT4VEpx7Kq0AzBPFEepzyrycHaIUW9j6YZE-yGsYsQ-M4EkPPijt7Sg8',
        imageUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAeoIjK6nXCrqBtXeehnTu_AfbWsDuiMq-XkvQNE_QlGzreiF5sbSNDlwjXos-R3uyqalm3Eo_sgD57lBDU-EWibkkwgcN2YDniZmeG0q73EtP6WSt2rwwWcDKF5lHXPkBVpFUtX7Kxnw3ipJ8mLQr-GFmkceS4UoCNSSP7vxvMCsg6jHR-AjG3wlw94uG_CUHNCH99UE34Ddt6PAXbu3mXT4VEpx7Kq0AzBPFEepzyrycHaIUW9j6YZE-yGsYsQ-M4EkPPijt7Sg8',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAK7i1stpq4kuWBiMATHh7hXYCPHW0Yr8H0qFB0zne5YJhSOnZjNEnexS-qkLRHFF3_bIikYSgEKAsgu_vHTuUNrA5mDHdI8RWBGfXVzjZIOmK68Q2U7SoTxJ7DPYxpeEvJjHnOVhYxXJRLaNuYt-OyXVgvuXErSWCHT3nnr1htERSAJrdtlwDb4khRbVCRYgmP86E8PS2owgDqpYe9BSOl6XU3yGen1RJZmJrz_1cXOYSjrFN30EV-ht2c8YaM5TE69bqdTSMtpEU',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFR1nm8mkOhJ0cE0PS2ytysdVRL62uPC5aAa-kosY2WtR1hd7iAh9BUT94R3QWWqbfM54lYjcvQWxZnS_XIf-Yn3ueVW9qvnc8x1mLtJghotCIPfzWoh54Ube2KBo8S-Zys8OIij4PsFnJ4SwHQv-7KJRj37MBmnU0SFiGdq4H7Xab6dN7-DBhbmOENrNNcaESSUkRXcPHzF-7RCSd92oSw-3dVzc2x6BeHiHiwhhyYWmxQQa-WI0vqZpAbLAhAHOM_LYdDe0jQQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCL2D7JE-4_XBXaXOCXaSsBGWobDbc_hgJssQZeBh0OW6TIsWi4OZ7IxmENSQ28m9i-4P8JWBjizPkXyB-WE_yO03zPUHj5gmTmGIK4XGJD4GKd6eCEzx1bDGc0wH6qvJiJOd4kkRwucwwRqLI-zt-6XuLHTOniVfTFMgucG48El2bMm7Uj_c-PX1tXAqSiwvrtCzy12toQG8RD1nXE3_sznAtqCY4d-gU3fOwViGWP-Sf4aiovrAx-BjM7TgxP1v3KNeY81cMWivE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDjXmhYjs9v7_zO27gHXnwdMQ5rfPTuup2UnjQ76DX5J_KJj71arjNA7J0VYeCzdxiIfq5rMqIGcc9eK1UBL4XII_5z6M_OXG0iEYxIApBimTfEnMWGeZrS8r0mo-thHCcp9BPPjxR4NYQd-fl_G_BBc3ZrMhEhcZXZP-NN7koQ-ut2bKtwIL83_X5FiRUVeCfFvdjty1XgZJWgctkE1i0IQO12GtgrTbD2DtdpiuW03NAW7AZP-EDOBXjAqtPzL3X447_BC-iXZos'
        ],
        description: 'Satu-satunya wilderness resort di Pulau Moyo yang dilindungi, Amanwana menyajikan tenda-tenda mewah ber-AC (Glamping) di tepi Laut Flores yang jernih dikelilingi hutan tropis alami. Destinasi eksklusif luar biasa bagi pencari ketenangan abadi dan petualangan laut liar kelas atas.',
        amenities: ['Private Beach', 'Scuba Diving', 'Luxury Glamping', 'Spa Terbuka', 'Wi-Fi Gratis', 'Kapal Pesiar Pribadi'],
        scarcityText: 'Tersisa 1 tenda liar!',
        tags: ['Alam', 'Pantai', 'Eksklusif']
    },
    {
        id: 'ritz-carlton-bali',
        name: 'The Ritz-Carlton, Bali',
        rating: 4.9,
        ratingText: 'Luar Biasa',
        stars: 5,
        location: 'Jalan Raya Nusa Dua Selatan, Bali',
        city: 'Bali',
        pricePerNight: 4500000,
        originalPricePerNight: 6800000,
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsmQxIPFALxGvEDeInaMBDSb_UatAyQTZQZYBT9r5Fye43c2XkNae06VF9xLOfZzM2BccbEEB_bX69RVeVVwpyTud72O7sKpeSwlxLM0Tav77LeU8IlmqBpJLbcorRcOVVEHTk1kTiWcTZAa3ZdmFs4nvMq3qlw5HUwrHDrZu0T2pw-NM_BPNPFlwDeAmpVs8geOrf37UcEyB0oQOOdDMbbck4gCX7vsMboL-hNNdNrPeYhapMjvnlx0rF3hylATJ28pVoKOoZ3rk',
        imageUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDsmQxIPFALxGvEDeInaMBDSb_UatAyQTZQZYBT9r5Fye43c2XkNae06VF9xLOfZzM2BccbEEB_bX69RVeVVwpyTud72O7sKpeSwlxLM0Tav77LeU8IlmqBpJLbcorRcOVVEHTk1kTiWcTZAa3ZdmFs4nvMq3qlw5HUwrHDrZu0T2pw-NM_BPNPFlwDeAmpVs8geOrf37UcEyB0oQOOdDMbbck4gCX7vsMboL-hNNdNrPeYhapMjvnlx0rF3hylATJ28pVoKOoZ3rk',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAK7i1stpq4kuWBiMATHh7hXYCPHW0Yr8H0qFB0zne5YJhSOnZjNEnexS-qkLRHFF3_bIikYSgEKAsgu_vHTuUNrA5mDHdI8RWBGfXVzjZIOmK68Q2U7SoTxJ7DPYxpeEvJjHnOVhYxXJRLaNuYt-OyXVgvuXErSWCHT3nnr1htERSAJrdtlwDb4khRbVCRYgmP86E8PS2owgDqpYe9BSOl6XU3yGen1RJZmJrz_1cXOYSjrFN30EV-ht2c8YaM5TE69bqdTSMtpEU',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFR1nm8mkOhJ0cE0PS2ytysdVRL62uPC5aAa-kosY2WtR1hd7iAh9BUT94R3QWWqbfM54lYjcvQWxZnS_XIf-Yn3ueVW9qvnc8x1mLtJghotCIPfzWoh54Ube2KBo8S-Zys8OIij4PsFnJ4SwHQv-7KJRj37MBmnU0SFiGdq4H7Xab6dN7-DBhbmOENrNNcaESSUkRXcPHzF-7RCSd92oSw-3dVzc2x6BeHiHiwhhyYWmxQQa-WI0vqZpAbLAhAHOM_LYdDe0jQQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCL2D7JE-4_XBXaXOCXaSsBGWobDbc_hgJssQZeBh0OW6TIsWi4OZ7IxmENSQ28m9i-4P8JWBjizPkXyB-WE_yO03zPUHj5gmTmGIK4XGJD4GKd6eCEzx1bDGc0wH6qvJiJOd4kkRwucwwRqLI-zt-6XuLHTOniVfTFMgucG48El2bMm7Uj_c-PX1tXAqSiwvrtCzy12toQG8RD1nXE3_sznAtqCY4d-gU3fOwViGWP-Sf4aiovrAx-BjM7TgxP1v3KNeY81cMWivE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDjXmhYjs9v7_zO27gHXnwdMQ5rfPTuup2UnjQ76DX5J_KJj71arjNA7J0VYeCzdxiIfq5rMqIGcc9eK1UBL4XII_5z6M_OXG0iEYxIApBimTfEnMWGeZrS8r0mo-thHCcp9BPPjxR4NYQd-fl_G_BBc3ZrMhEhcZXZP-NN7koQ-ut2bKtwIL83_X5FiRUVeCfFvdjty1XgZJWgctkE1i0IQO12GtgrTbD2DtdpiuW03NAW7AZP-EDOBXjAqtPzL3X447_BC-iXZos'
        ],
        description: 'Menghadap langsung ke perairan biru Samudra Hindia, The Ritz-Carlton Bali menyajikan kemewahan tepi pantai yang spektakuler. Dilengkapi dengan kolam renang infinity yang megah di tebing tinggi Nusa Dua, villa pribadi yang luas, layanan concierge istimewa, serta perawatan spa tradisional Bali yang memulihkan energi.',
        amenities: ['Sarapan Gratis', 'Wi-Fi Gratis', 'Kolam Renang Infinity', 'Restoran Tepi Pantai', 'Pusat Kebugaran', 'Kids Club'],
        scarcityText: 'Hanya tersisa 1 kamar!',
        tags: ['Pantai', 'Mewah', 'Romantis']
    },
    {
        id: 'ayana-resort',
        name: 'AYANA Resort Bali',
        rating: 4.7,
        ratingText: 'Fantastis',
        stars: 5,
        location: 'Jalan Karang Mas Sejahtera, Jimbaran, Bali',
        city: 'Bali',
        pricePerNight: 5200000,
        thumbnailUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAg6jotd1_gUwGeUzTgu9lXXx8U0aiIynO24ogwNqeEl9aa5ueZOzXfUvnuRXhMenQSIwcsgFlb4nih01nQp0cmBN7CHeQ2Cb-6Sim_Hx1svJGemEmId5IyjOo7pBNzA_Ah7PhAAXQMyalL7JrGBwnJvZ8LEmG1IuFQ-DOOM9WJUNatSwMzZrMe6T3NNFrcl7aFgWsKIqqlg0Key1V1KHhgsrYjoQ7zLlNXErUkzjt6yarbpq9rSgbgDJrPuzRISOjGHneIC4jEOQc',
        imageUrls: [
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAg6jotd1_gUwGeUzTgu9lXXx8U0aiIynO24ogwNqeEl9aa5ueZOzXfUvnuRXhMenQSIwcsgFlb4nih01nQp0cmBN7CHeQ2Cb-6Sim_Hx1svJGemEmId5IyjOo7pBNzA_Ah7PhAAXQMyalL7JrGBwnJvZ8LEmG1IuFQ-DOOM9WJUNatSwMzZrMe6T3NNFrcl7aFgWsKIqqlg0Key1V1KHhgsrYjoQ7zLlNXErUkzjt6yarbpq9rSgbgDJrPuzRISOjGHneIC4jEOQc',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuAK7i1stpq4kuWBiMATHh7hXYCPHW0Yr8H0qFB0zne5YJhSOnZjNEnexS-qkLRHFF3_bIikYSgEKAsgu_vHTuUNrA5mDHdI8RWBGfXVzjZIOmK68Q2U7SoTxJ7DPYxpeEvJjHnOVhYxXJRLaNuYt-OyXVgvuXErSWCHT3nnr1htERSAJrdtlwDb4khRbVCRYgmP86E8PS2owgDqpYe9BSOl6XU3yGen1RJZmJrz_1cXOYSjrFN30EV-ht2c8YaM5TE69bqdTSMtpEU',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuBTFR1nm8mkOhJ0cE0PS2ytysdVRL62uPC5aAa-kosY2WtR1hd7iAh9BUT94R3QWWqbfM54lYjcvQWxZnS_XIf-Yn3ueVW9qvnc8x1mLtJghotCIPfzWoh54Ube2KBo8S-Zys8OIij4PsFnJ4SwHQv-7KJRj37MBmnU0SFiGdq4H7Xab6dN7-DBhbmOENrNNcaESSUkRXcPHzF-7RCSd92oSw-3dVzc2x6BeHiHiwhhyYWmxQQa-WI0vqZpAbLAhAHOM_LYdDe0jQQ',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuCL2D7JE-4_XBXaXOCXaSsBGWobDbc_hgJssQZeBh0OW6TIsWi4OZ7IxmENSQ28m9i-4P8JWBjizPkXyB-WE_yO03zPUHj5gmTmGIK4XGJD4GKd6eCEzx1bDGc0wH6qvJiJOd4kkRwucwwRqLI-zt-6XuLHTOniVfTFMgucG48El2bMm7Uj_c-PX1tXAqSiwvrtCzy12toQG8RD1nXE3_sznAtqCY4d-gU3fOwViGWP-Sf4aiovrAx-BjM7TgxP1v3KNeY81cMWivE',
            'https://lh3.googleusercontent.com/aida-public/AB6AXuDjXmhYjs9v7_zO27gHXnwdMQ5rfPTuup2UnjQ76DX5J_KJj71arjNA7J0VYeCzdxiIfq5rMqIGcc9eK1UBL4XII_5z6M_OXG0iEYxIApBimTfEnMWGeZrS8r0mo-thHCcp9BPPjxR4NYQd-fl_G_BBc3ZrMhEhcZXZP-NN7koQ-ut2bKtwIL83_X5FiRUVeCfFvdjty1XgZJWgctkE1i0IQO12GtgrTbD2DtdpiuW03NAW7AZP-EDOBXjAqtPzL3X447_BC-iXZos'
        ],
        description: 'AYANA Resort Bali berlokasi di atas tebing kapur yang megah menghadap Teluk Jimbaran. Terkenal secara global berkat Rock Bar yang ikonis, resort terpadu super mewah seluas 90 hektar ini menyajikan pilihan 14 kolam renang infinity, spa hidroterapi air laut murni, serta keindahan sunset laut tropis yang memukau.',
        amenities: ['Spa & Wellness', 'Antar Jemput Bandara', 'Rock Bar Access', '14 Kolam Renang', 'Akses Pantai Pribadi', 'Wi-Fi Gratis'],
        tags: ['Tebing', 'Sunset', 'Romantis']
    }
];

// Curated Promotions Coupon Data
const INITIAL_PROMOS: Promo[] = [
    {
        id: 'promo-1',
        category: 'FLASH SALE',
        title: 'Bali Luxury Flash Sale 50%',
        description: 'Diskon 50% untuk semua vila tebing di Nusa Dua dan Jimbaran.',
        code: 'BALILUX50',
        discountText: 'DISKON 50%',
        imageUrl: 'https://lh3.googleusercontent.com/aida/ADBb0uhX2oqV_MXLKrXaSdjqDS5x9LDfJtJrbuNCZ8QvfqqvFLjM6idXXb2IENXDpio8KGndUVEF0Q_15h0Pp8ErtwZbzxqyL9Ngl972JF0n0xLvotS96BgHfWmRcIxYV4uJlv-ne57A2kkWLZ2CbMlO8V7hbE2PbIv0yU5s7BVPV_WQ55-jEPtQViHLOSflUZ5GpkKIna6VBbST6W4TAOdEP7qX5g1k5TKwm_dnbZfxxoQMIax_btHnYLVpIg',
        validUntil: '31 Des 2026',
    },
    {
        id: 'promo-2',
        category: 'STAYCATION',
        title: 'Jakarta Staycation Premium Voucher',
        description: 'Nikmati akhir pekan premium di jantung kota SCBD dengan harga eksklusif.',
        code: 'JKTSTAY',
        discountText: 'POTONGAN Rp 350RB',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvmvwMkxB4TAaPN_IDANurz_hKqhdo9kcO2JwokDtBXhM-AsBrZpNbQhT2rxEyNZJJNcPhnxhXpZVQp6e-6WM9sBz5VrNO_hlYlRQhblVEunB1zDSqgB1QFP1ruxfuuagpdS0b0Y3WQmwuqUt2hB2nMD45lRO8hCvyTCfXc5lxhyG1OLF1ki5ZxcIuBfO7fOqfkVYn_UIETacC69w_kYkQvakc179gSSAA09pyhHfgjLyJHllc_1NoJ5wiJEYWiSmx8Mu1FhDkDbQ',
        validUntil: '31 Des 2026',
    },
    {
        id: 'promo-3',
        category: 'SPA',
        title: 'Aromatherapy Traditional Spa Wellness',
        description: 'Diskon 30% untuk seluruh paket perawatan spa tradisional di Ayana & Nusa Dua.',
        code: 'RELAX30',
        discountText: 'DISKON 30%',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF-et3rG61uTAZkPSZWKvDwfIxSZOwhW1VwvxVcQ--Un3nR3t425HiwYfnMDR_XQm--zal_LbBvcgHRkNNF8AqSeqSfyz6__o8HT12S4V-OCGWN8yt7WsyqhAWtdYS9wwOPsLAXNq0XYmTtp2o-ti1xl59N0e6SLcpyce4PR8bg3Yd-lnUe8qthrZDL0sxDgm-dAr5oPHuk5S2BqjcW1s1P0csynzu0hf0hDuiIoUioDisZTAtV8tx4eGfJ_kIrZDCKIBVlNtzyWc',
        validUntil: '30 Nov 2026',
    },
    {
        id: 'promo-4',
        category: 'TIKET PESAWAT',
        title: 'Premium Flight First Class GrandStar',
        description: 'Cashback Rp 500rb untuk pemesanan tiket penerbangan Garuda Indonesia First Class.',
        code: 'FLYGRAND24',
        discountText: 'CASHBACK Rp 500RB',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPUSB6D4TIUx5ycUwmdcS-9QEL95AsDpEKYI2lOo5LkXsmEbSG2uU1muRm_aMXg0KQSYGdjMRHZ43bCiGK3akqxxR00ervoj7sJE8unzjoZbVo78DAfhjab_0R2OgTqOen8R0_NdBtCAYqavFRgOTY_793oX9mN6XHiidng0e1ItDf4psmhgv9vS7EEABSNLM2MO9aJFrJlYxM9qVOe04F38KYkUZU95I2hzOCylZrF78c0ARdGuijqL-3SwD2s0lLgG_8XQLa8f8',
        validUntil: '31 Des 2026',
    }
];

export default function App() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('home');
    const [searchQuery, setSearchQuery] = useState('Bali');
    const [selectedHotelId, setSelectedHotelId] = useState('nusa-dua-beach');
    const [walletBalance, setWalletBalance] = useState(2450000);
    const [searchType, setSearchType] = useState<'hotel' | 'flight'>('hotel');
    const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

    // Success / Error Toast alert states
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    // Initial user state (null means guest)
    const [user, setUser] = useState<UserProfile | null>(null);

    // Prepopulated user bookings history for interaction demonstration
    const [bookings, setBookings] = useState<Booking[]>([
        {
            id: 'GS-H-4927',
            hotelId: 'ayana-resort',
            hotelName: 'The Apurva Kempinski Bali',
            hotelImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNmE_LQxEoR5unU3qonzGgOA5UTDJp-HqeP2GdUb8nt0-KN6FxZXyWtwybHDCpbrVSQJfzKA3BWYd_OhLhPImG7NUj0sVSq3A3mQWoEittjTS6qTExg2iyvZxp7-hrWfrkAm9rqSvM1DeskMYi-OZrxPnomiMbmhWcGKQr4sV10FfoPyk692lLebc4F_iq5pi0p3gkh5Q-OuESYxhXZcjUTNedbyT9AREOuXYXI-cmrApadpicWbX4sOSrp4d_5ZrVI-EsOT3Hi3s',
            stars: 5,
            rating: 4.8,
            checkInDate: '24 Okt 2024',
            checkOutDate: '27 Okt 2024',
            nights: 3,
            guestName: 'Budi Santoso',
            guestsText: '2 Tamu, 1 Kamar',
            totalPrice: 15835000,
            status: 'Aktif',
        },
    ]);

    const [checkoutDetails, setCheckoutDetails] = useState({
        checkInDate: '24 Okt 2024',
        checkOutDate: '27 Okt 2024',
        nights: 3,
        guestsText: '2 Tamu, 1 Kamar',
    });

    const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(msg);
        setToastType(type);
    };

    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => {
                setToastMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Route Protection Logic
    useEffect(() => {
        const protectedTabs: ActiveTab[] = ['wallet', 'review', 'dashboard', 'checkout'];
        if (protectedTabs.includes(activeTab) && !user) {
            triggerToast('Silakan login terlebih dahulu untuk mengakses halaman ini.', 'error');
            setActiveTab('auth-login');
        }
    }, [activeTab, user]);

    // Render Admin Console if user is admin
    if (user?.role === 'admin') {
        return <AdminConsole onLogout={() => setUser(null)} />;
    }

    const selectedHotelObj =
        INITIAL_HOTELS.find((h) => h.id === selectedHotelId) || INITIAL_HOTELS[0];

    return (
        <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-[#191c1e] dark:bg-[#031636] dark:text-white transition-all">
            {/* Dynamic Success/Error Toast Notification Alert */}
            {toastMessage && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
                    <div
                        className={`px-6 py-4 rounded-full shadow-2xl flex items-center space-x-2 border text-xs md:text-sm font-semibold select-none ${toastType === 'success'
                                ? 'bg-emerald-500 text-white border-emerald-400'
                                : 'bg-red-500 text-white border-red-400'
                            }`}
                    >
                        <span>{toastMessage}</span>
                    </div>
                </div>
            )}

            {/* Persistent Navigation Header */}
            <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                user={user}
                walletBalance={walletBalance}
                searchType={searchType}
                setSearchType={setSearchType}
            />

            {/* State-Driven View Router Container */}
            <div className="flex-grow flex flex-col">
                {activeTab === 'home' && (
                    <LandingPage
                        setActiveTab={setActiveTab}
                        setSearchQuery={setSearchQuery}
                        setSelectedHotelId={setSelectedHotelId}
                        setSearchType={setSearchType}
                    />
                )}

                {activeTab === 'search' && (
                    <SearchResults
                        hotels={INITIAL_HOTELS}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        setActiveTab={setActiveTab}
                        setSelectedHotelId={setSelectedHotelId}
                        searchType={searchType}
                        setSearchType={setSearchType}
                        setSelectedFlight={(f) => {
                            setSelectedFlight(f);
                            // Make sure to populate the guest details checkInDate matching current search state or today
                            if (f) {
                                setCheckoutDetails({
                                    checkInDate: '24 Okt 2024',
                                    checkOutDate: '24 Okt 2024',
                                    nights: 0,
                                    guestsText: '1 Penumpang, ' + f.classType
                                });
                            }
                        }}
                    />
                )}

                {activeTab === 'detail' && (
                    <PropertyDetail
                        hotel={selectedHotelObj}
                        setActiveTab={setActiveTab}
                        checkoutDetails={checkoutDetails}
                        setCheckoutDetails={setCheckoutDetails}
                        user={user}
                    />
                )}

                {activeTab === 'checkout' && (
                    <Checkout
                        hotel={selectedHotelObj}
                        checkoutDetails={checkoutDetails}
                        user={user!}
                        setUser={setUser}
                        walletBalance={walletBalance}
                        setWalletBalance={setWalletBalance}
                        bookings={bookings}
                        setBookings={setBookings}
                        setActiveTab={setActiveTab}
                        onSuccessToast={(msg) => triggerToast(msg, 'success')}
                        onErrorToast={(msg) => triggerToast(msg, 'error')}
                        selectedFlight={selectedFlight}
                    />
                )}

                {(activeTab === 'auth-login' || activeTab === 'auth-register') && (
                    <Auth
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        setUser={setUser}
                        onSuccessToast={(msg) => triggerToast(msg, 'success')}
                    />
                )}

                {activeTab === 'dashboard' && (
                    <Dashboard
                        user={user!}
                        setUser={setUser}
                        bookings={bookings}
                        setActiveTab={setActiveTab}
                        setSelectedHotelId={setSelectedHotelId}
                        onSuccessToast={(msg) => triggerToast(msg, 'success')}
                    />
                )}

                {activeTab === 'review' && (
                    <WriteReview
                        hotel={selectedHotelObj}
                        setActiveTab={setActiveTab}
                        onSuccessToast={(msg) => triggerToast(msg, 'success')}
                    />
                )}

                {activeTab === 'checkin' && (
                    <CheckInOnline
                        hotel={selectedHotelObj}
                        user={user!}
                        setActiveTab={setActiveTab}
                    />
                )}

                {activeTab === 'wallet' && (
                    <WalletTopUp
                        user={user!}
                        walletBalance={walletBalance}
                        setWalletBalance={setWalletBalance}
                        setActiveTab={setActiveTab}
                        onSuccessToast={(msg) => triggerToast(msg, 'success')}
                    />
                )}

                {activeTab === 'promosi' && (
                    <Promosi
                        promos={INITIAL_PROMOS}
                        setActiveTab={setActiveTab}
                        onSuccessToast={(msg) => triggerToast(msg, 'success')}
                    />
                )}
            </div>

            {/* Persistent Footer */}
            <Footer setActiveTab={setActiveTab} />
        </div>
    );
}
