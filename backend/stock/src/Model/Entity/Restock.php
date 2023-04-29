<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Restock Entity
 *
 * @property int $id
 * @property string $restockid
 * @property string $barcode
 * @property string $name
 * @property float $unitprice
 * @property int $quantity
 * @property \Cake\I18n\FrozenTime $date
 */
class Restock extends Entity
{
    /**
     * Fields that can be mass assigned using newEntity() or patchEntity().
     *
     * Note that when '*' is set to true, this allows all unspecified fields to
     * be mass assigned. For security purposes, it is advised to set '*' to false
     * (or remove it), and explicitly make individual fields accessible as needed.
     *
     * @var array<string, bool>
     */
    protected $_accessible = [
        'restockid' => true,
        'barcode' => true,
        'name' => true,
        'unitprice' => true,
        'quantity' => true,
        'date' => true,
    ];
}
