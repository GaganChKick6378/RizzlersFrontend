import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { FooterConfig } from '@/interfaces/landingConfig.interface';

const Footer = () => {
  const { config } = useSelector((state: RootState) => state.landingConfig);

  // Use the footer configuration from the API
  const footerData: FooterConfig | undefined = config?.footer;

  return (
    <footer className="w-screen h-[5.25rem] bg-[#130739] text-white lg:pl-[5.0625rem] lg:pr-[5.0625rem] md:p-2 pl-4 pr-4 text-center">
      <div className="flex justify-between items-center h-full w-full">
        <div className="flex items-center">
          <img 
            src={footerData?.image?.url || ""} 
            alt={footerData?.image?.alt || "Kickdrum"} 
            className="h-[1.5625rem] w-[8.839375rem]" 
          />
        </div>
        <div className="flex flex-col items-end gap-y-[0.0125rem] max-w-[17.0625rem] font-400 text-sm">
          <p>{footerData?.copyright || "© Kickdrum Technology Group LLC."}</p>
          <p>{footerData?.desc || "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
