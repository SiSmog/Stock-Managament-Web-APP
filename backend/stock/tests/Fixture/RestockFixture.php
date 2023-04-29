<?php
declare(strict_types=1);

namespace App\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

/**
 * RestockFixture
 */
class RestockFixture extends TestFixture
{
    /**
     * Table name
     *
     * @var string
     */
    public $table = 'restock';
    /**
     * Init method
     *
     * @return void
     */
    public function init(): void
    {
        $this->records = [
            [
                'id' => 1,
                'restockid' => 'Lorem ipsum dolor sit amet',
                'barcode' => 'Lorem ipsu',
                'name' => 'Lorem ipsum dolor sit amet',
                'unitprice' => 1,
                'quantity' => 1,
                'date' => 1662490706,
            ],
        ];
        parent::init();
    }
}
