<?php
declare(strict_types=1);

namespace App\Model\Table;

use Cake\ORM\Query;
use Cake\ORM\RulesChecker;
use Cake\ORM\Table;
use Cake\Validation\Validator;

/**
 * Restock Model
 *
 * @method \App\Model\Entity\Restock newEmptyEntity()
 * @method \App\Model\Entity\Restock newEntity(array $data, array $options = [])
 * @method \App\Model\Entity\Restock[] newEntities(array $data, array $options = [])
 * @method \App\Model\Entity\Restock get($primaryKey, $options = [])
 * @method \App\Model\Entity\Restock findOrCreate($search, ?callable $callback = null, $options = [])
 * @method \App\Model\Entity\Restock patchEntity(\Cake\Datasource\EntityInterface $entity, array $data, array $options = [])
 * @method \App\Model\Entity\Restock[] patchEntities(iterable $entities, array $data, array $options = [])
 * @method \App\Model\Entity\Restock|false save(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Restock saveOrFail(\Cake\Datasource\EntityInterface $entity, $options = [])
 * @method \App\Model\Entity\Restock[]|\Cake\Datasource\ResultSetInterface|false saveMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Restock[]|\Cake\Datasource\ResultSetInterface saveManyOrFail(iterable $entities, $options = [])
 * @method \App\Model\Entity\Restock[]|\Cake\Datasource\ResultSetInterface|false deleteMany(iterable $entities, $options = [])
 * @method \App\Model\Entity\Restock[]|\Cake\Datasource\ResultSetInterface deleteManyOrFail(iterable $entities, $options = [])
 */
class RestockTable extends Table
{
    /**
     * Initialize method
     *
     * @param array $config The configuration for the Table.
     * @return void
     */
    public function initialize(array $config): void
    {
        parent::initialize($config);

        $this->setTable('restock');
        $this->setDisplayField('id');
        $this->setPrimaryKey('id');
    }
}
