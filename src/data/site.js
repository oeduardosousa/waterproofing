// Placeholder business data. Everything here is "exemplo" until the owner supplies real details.
export const site = {
  name: 'Seca Obra',
  nameNote: 'nome de exemplo',
  whatsappNumber: '5500000000000',
  whatsappDisplay: '+55 (00) 00000-0000',
  defaultMessage: 'Olá! Vim pelo site e gostaria de um orçamento de impermeabilização.',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/' },
    { label: 'Facebook', href: 'https://www.facebook.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
};

export const wa = (message = site.defaultMessage) =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
