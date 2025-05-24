import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  deleteCategory,
  restoreCategory,
} from '../../../service/business/categories/CategoryService';
import './CategoryToggle.css';
const MySwal = withReactContent(Swal);

interface CategoryToggleProps {
  categoryId: number;
  initiallyDeleted?: boolean;
  onStatusChange?: (newDeleted: boolean) => void;
}

const CategoryToggle: React.FC<CategoryToggleProps> = ({
  categoryId,
  initiallyDeleted = false,
  onStatusChange,
}) => {
  const [isDeleted, setIsDeleted] = useState(initiallyDeleted);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsDeleted(initiallyDeleted);
  }, [initiallyDeleted]);

  const handleToggle = async () => {
    const action = isDeleted ? 'khôi phục' : 'xóa';
    const confirmResult = await MySwal.fire({
      title: `Bạn có chắc muốn ${action} danh mục này?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
    });

    if (confirmResult.isConfirmed) {
      setLoading(true);
      try {
        if (isDeleted) {
          await restoreCategory(categoryId);
          setIsDeleted(false);
          onStatusChange?.(false);
          Swal.fire('Đã khôi phục!', '', 'success');
        } else {
          await deleteCategory(categoryId);
          setIsDeleted(true);
          onStatusChange?.(true);
          Swal.fire('Đã xóa!', '', 'success');
        }
      } catch (error) {
        console.error('Toggle failed:', error);
        Swal.fire('Lỗi', 'Đã có lỗi xảy ra!', 'error');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={!isDeleted}
        onChange={handleToggle}
        disabled={loading}
      />
      <span className="slider round"></span>
    </label>
  );
};

export default CategoryToggle;
