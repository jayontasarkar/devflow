import Image from 'next/image';
import Link from 'next/link';

interface IProps {
  imgUrl: string;
  alt: string;
  value: number | string;
  title: string;
  href?: string;
  textStyle?: string;
  isAuthor?: boolean;
}

const Metric = ({
  imgUrl,
  alt,
  value,
  title,
  href,
  textStyle,
  isAuthor,
}: IProps) => {
  const renderMetric = (
    <>
      <Image
        src={imgUrl}
        height={16}
        width={16}
        alt={alt}
        className={`object-contain ${href ? 'rounded-full' : ''}`}
      />
      <p className={`${textStyle} flex items-center gap-1`}>
        {value}
        <span
          className={`small regular line-clamp-1 ${
            isAuthor ? 'max-sm:hidden' : ''
          }`}
        >
          {title}
        </span>
      </p>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="flex-center gap-1">
        {renderMetric}
      </Link>
    );
  }

  return <div className="flex-center flex-wrap gap-1">{renderMetric}</div>;
};

export default Metric;
