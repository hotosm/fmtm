import { CommonActions } from '../../store/slices/CommonSlice';
import Button from '../../components/common/Button';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../types/reduxTypes';

const UploadArea = ({ flag, page }) => {
  const dispatch = useDispatch();

  const projectDetails: any = useAppSelector((state) => state.createproject.projectDetails);

  const toggleStepNext = () => {
    dispatch(CommonActions.SetCurrentStepFormStep({ flag: flag, step: 2, children: 2 }));
  };
  return (
    <div>
      <div className="fmtm-w-fit fmtm-mx-auto fmtm-mt-10">
        {page === 1 && (
          <div>
            <div className="fmtm-bg-red-400">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum numquam consequatur neque. Quae
              voluptatibus, est aspernatur ratione dignissimos debitis fuga reiciendis quis corrupti eligendi laudantium
              aperiam non voluptatum sit fugit. Dolore facilis ut illum debitis animi fugiat sed et asperiores, maxime
              ad libero quasi sint harum! Aperiam facere impedit illo sed modi inventore consectetur laudantium
              perspiciatis quibusdam cum id debitis eius iste, placeat nisi necessitatibus accusamus odio laboriosam
              beatae quas adipisci rerum! Hic maxime quos officiis voluptas dolore eos dolorem rerum odio adipisci
              delectus reprehenderit exercitationem illum, amet porro est ab cumque voluptatem neque vel incidunt. Nisi
              voluptas vel debitis. Consectetur harum autem est quam sapiente sed ullam eligendi et odit, ipsa eveniet
              facere aut molestiae excepturi esse dicta dolores similique corporis velit voluptates neque iste? Ab
              consequuntur esse beatae vel, ipsa labore quibusdam reiciendis quis, ullam tenetur, odio fuga quam.
              Perspiciatis voluptates eos consequatur tempora nobis
            </div>
            <Button
              btnText="NEXT"
              btnType="primary"
              type="button"
              onClick={() => toggleStepNext()}
              className="fmtm-font-bold"
            />
          </div>
        )}
        {page === 2 && (
          <div>
            <div className="fmtm-bg-green-400">
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur eum incidunt nam illo porro deserunt,
              voluptas nostrum quasi saepe et tempore quas autem, perspiciatis exercitationem odit qui non iusto
              reiciendis blanditiis neque ab quia veritatis! Molestiae, nesciunt. Repellendus nisi rerum sunt iste
              corrupti aliquam unde quidem, quae, aliquid omnis fuga?
            </div>
            <Button
              btnText="NEXT"
              btnType="primary"
              type="button"
              onClick={() => toggleStepNext()}
              className="fmtm-font-bold"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadArea;
