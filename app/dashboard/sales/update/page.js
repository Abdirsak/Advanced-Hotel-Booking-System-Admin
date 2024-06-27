import { useRouter } from 'next/router';
import SalesFormRegistration from '../../sales/new'; // Adjust the path to your form component

const SalesUpdatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return <p>Loading...</p>;
  }

  return <SalesFormRegistration saleId={id} />;
};

export default SalesUpdatePage;
