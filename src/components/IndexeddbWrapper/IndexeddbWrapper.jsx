import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import Sidebar from '../Sidebar';
import Modal from '../Modal/Modal';
import { addData, editData, deleteData, getAllData } from '../../helpers/indexeddb';
import { StatusContext } from '../../context/statusContext';
import { SearchContext } from '../../context/searchContext';
import { DataContext } from '../../context/dataContext';
import { useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function IndexeddbWrapper() {
  let { noteId } = useParams();
  const {add, edit, delete:deleteActive, changeStatus} = useContext(StatusContext);
  const {data, changeData} = useContext(DataContext);
  const { searchPhrase, searchedData, changeSearchPhrase } = useContext(SearchContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    getAllData().then(data => {
      changeData(data);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(deleteActive) {
      let dataToDelete = data[noteId - 1];
      if (searchPhrase !== '') {
        dataToDelete = searchedData[noteId - 1];
        changeSearchPhrase('');
      }
      deleteData(dataToDelete).then(() => {
        changeStatus('delete');
        getAllData().then(data => {
          navigate(`/notes`);
          changeData(data);
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteActive]);

  useEffect(() => {
    if(edit) {
      editData(data[noteId - 1])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if(add) {
      changeStatus('add');
      const date = new Date();
      addData({date: date, markdown: ''}).then(() => {
        getAllData().then(data => {
          changeData(data);
          navigate(`/notes/${data.length}`);
          if (!edit) {
            changeStatus('edit');
          }
        })
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [add]);

return <div className='container'>
          <Modal />
          <Header />
          <div className='content'>
            <Sidebar />
            <Outlet />
          </div>
  </div>
}

export default IndexeddbWrapper;