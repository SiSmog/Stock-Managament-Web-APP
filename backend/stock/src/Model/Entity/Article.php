<?php
declare(strict_types=1);

namespace App\Model\Entity;

use Cake\ORM\Entity;

/**
 * Article Entity
 *
 * @property string $barcode
 * @property string $name
 * @property string $image
 * @property int $quantity
 * @property \Cake\I18n\FrozenTime $adddate
 * @property string $description
 */
class Article extends Entity
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
        'barcode' => true,
        'name' => true,
        'image' => true,
        'quantity' => true,
        'adddate' => true,
        'description' => true,
    ];
}
